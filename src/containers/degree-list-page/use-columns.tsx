import { ColumnDef } from "@tanstack/react-table";
import { Degree } from "@/models/degree";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  XCircle,
  Check,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { TFunction } from "i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { TableSelectAllCheckbox } from "@/components/ui/table-select-all-checkbox";

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export interface DegreeColumnsConfig {
  t: TFunction;
  onView?: (degree: Degree) => void;
  onEdit?: (degree: Degree) => void;
  onDelete?: (degree: Degree) => void;
  onConfirm?: (degree: Degree) => void;
  currentTab?: string;
  searchParams?: URLSearchParams;
}

export function useColumns(config: DegreeColumnsConfig): ColumnDef<Degree>[] {
  const role = useSelector((state: RootState) => state.user.role);
  const t = config.t;
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "chưa duyệt":
        return "bg-blue-100 text-blue-800";
      case "đã duyệt":
        return "bg-green-100 text-green-800";
      case "đã từ chối":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionUrl = (action: string, id: number) => {
    const params = new URLSearchParams(
      Array.from(config.searchParams?.entries?.() || [])
    );
    params.set("action", action);
    params.set("id", id.toString());
    if (!params.get("tab") && config.currentTab) {
      params.set("tab", config.currentTab);
    }
    return `?${params.toString()}`;
  };

  const handleView = (id: number) => () => {
    router.push(getActionUrl("view", id));
  };
  const handleEdit = (id: number) => () => {
    router.push(getActionUrl("edit", id));
  };
  const handleReject = (id: number) => () => {
    router.push(getActionUrl("reject", id));
  };
  const handleConfirm = (id: number) => () => {
    router.push(getActionUrl("confirm", id));
  };

  const handleDelete =
    (id: number, degreeName: string, studentName: string) => () => {
      const params = new URLSearchParams(
        Array.from(config.searchParams?.entries?.() || [])
      );
      params.set("action", "delete");
      params.set("id", id.toString());
      params.set("degreeName", encodeURIComponent(degreeName));
      params.set("studentName", encodeURIComponent(studentName));
      router.push(`?${params.toString()}`);
    };

  const columns: ColumnDef<Degree>[] = [];

  // Thêm cột select nếu là PDT và status khác 'đã duyệt'
  if (role === "PDT" || role === "KHOA") {
    columns.push({
      id: "select",
      header: ({ table }) => {
        const rows = table.getRowModel().rows;
        return (
          <TableSelectAllCheckbox
            rows={rows}
            isRowSelectable={(row) =>
              row.original.status?.toLowerCase() === "chưa duyệt"
            }
            getIsSelected={(row) => row.getIsSelected?.()}
            toggleSelected={(row, checked) => row.toggleSelected?.(checked)}
          />
        );
      },
      cell: ({ row }) =>
        row.original.status?.toLowerCase() === "chưa duyệt" ? (
          <Checkbox
            checked={!!row.getIsSelected?.()}
            disabled={!row.getCanSelect?.()}
            onCheckedChange={row.getToggleSelectedHandler?.()}
            aria-label="Select row"
          />
        ) : null,
      enableSorting: false,
      enableHiding: false,
      size: 32,
      maxSize: 32,
    });
  }

  columns.push(
    {
      id: "STT",
      header: t("common.stt"),
      cell: ({ row }) => row.index + 1,
      size: 48,
      maxSize: 48,
    },
    {
      accessorKey: "nameStudent",
      header: t("degrees.nameStudent"),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("nameStudent")}</div>
      ),
    },
    {
      accessorKey: "className",
      header: t("degrees.className"),
    },
    {
      accessorKey: "department",
      header: t("degrees.department"),
      cell: ({ row }) => (
        <div
          className="max-w-[150px] truncate"
          title={row.getValue("department") as string}
        >
          {row.getValue("department")}
        </div>
      ),
    },
    {
      accessorKey: "graduationYear",
      header: t("degrees.graduationYear", "Năm tốt nghiệp"),
    },
    {
      accessorKey: "diplomaNumber",
      header: t("degrees.diplomaNumber"),
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("diplomaNumber")}</div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: t("degrees.issueDate"),
      cell: ({ row }) => formatDate(row.getValue("issueDate") as string),
    },
    {
      accessorKey: "status",
      header: t("degrees.status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("common.createdAt"),
      cell: ({ row }) => formatDate(row.getValue("createdAt") as string),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("common.actions")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleView(row.original.id)}>
              <Eye className="mr-2 h-4 w-4" />
              {t("common.view")}
            </DropdownMenuItem>
            {role === "PDT" &&
              row.original.status?.toLowerCase() === "chưa duyệt" && (
                <>
                  <DropdownMenuItem onClick={handleConfirm(row.original.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    {t("common.confirm")}
                  </DropdownMenuItem>
                </>
              )}
            {role === "PDT" &&
              row.original.status?.toLowerCase() === "chưa duyệt" && (
                <>
                  <DropdownMenuItem onClick={handleReject(row.original.id)}>
                    <XCircle className="mr-2 h-4 w-4 text-red-600" />
                    <span className="text-red-600">{t("common.reject")}</span>
                  </DropdownMenuItem>
                </>
              )}
            {role === "KHOA" &&
              row.original.status?.toLowerCase() === "chưa duyệt" && (
                <DropdownMenuItem onClick={handleEdit(row.original.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
              )}
            {role === "KHOA" &&
              row.original.status?.toLowerCase() === "chưa duyệt" && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleDelete(
                    row.original.id,
                    row.original.degreeTitleName,
                    row.original.nameStudent
                  )}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("common.delete")}
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 48,
      maxSize: 48,
    }
  );

  return columns;
}
