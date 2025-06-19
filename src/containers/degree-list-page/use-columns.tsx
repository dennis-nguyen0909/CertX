import { ColumnDef } from "@tanstack/react-table";
import { Degree } from "@/models/degree";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { TFunction } from "i18next";
import { Checkbox } from "@/components/ui/checkbox";

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
}

export function useColumns(config: DegreeColumnsConfig): ColumnDef<Degree>[] {
  const role = useSelector((state: RootState) => state.user.role);
  const t = config.t;
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "chưa duyệt":
        return "bg-red-100 text-red-800";
      case "đã duyệt":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: ColumnDef<Degree>[] = [];

  // Thêm cột select nếu là PDT và status khác 'đã duyệt'
  if (role === "PDT") {
    columns.push({
      id: "select",
      header: ({ table }) => {
        const handleSelectAll = () => {
          const handler = table.getToggleAllPageRowsSelectedHandler?.();
          if (handler) {
            handler({
              target: { checked: !table.getIsAllPageRowsSelected?.() },
            });
          }
        };
        return (
          <Checkbox
            checked={
              !!table.getIsAllPageRowsSelected?.() &&
              table.getRowModel().rows.length > 0
            }
            onCheckedChange={handleSelectAll}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) =>
        row.original.status?.toLowerCase() !== "đã duyệt" ? (
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
            <DropdownMenuItem onClick={() => config?.onView?.(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              {t("common.view")}
            </DropdownMenuItem>
            {role === "PDT" &&
              row.original.status?.toLowerCase() !== "đã duyệt" && (
                <>
                  <DropdownMenuItem
                    onClick={() => config?.onConfirm?.(row.original)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {t("degrees.confirmAction")}
                  </DropdownMenuItem>
                </>
              )}
            {/* <DropdownMenuItem onClick={() => config?.onEdit?.(row.original)}>
              <Pencil className="mr-2 h-4 w-4" />
              {t("common.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => config?.onDelete?.(row.original)}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t("common.delete")}
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 48,
      maxSize: 48,
    }
  );

  return columns;
}
