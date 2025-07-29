import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TFunction } from "i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Check, X, Edit, Trash } from "lucide-react";
import { Certificate } from "@/models/certificate";
import { useAuth } from "@/contexts/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { TableSelectAllCheckbox } from "@/components/ui/table-select-all-checkbox";

export interface CertificateColumnsConfig {
  t: TFunction;
  onView?: (certificate: Certificate) => void;
  onEdit?: (certificate: Certificate) => void;
  onDelete?: (certificate: Certificate) => void;
  currentTab?: string;
  searchParams?: URLSearchParams;
}

export function useColumns(
  config: CertificateColumnsConfig
): ColumnDef<Certificate>[] {
  const router = useRouter();
  const { role } = useAuth();
  const t = config.t;

  // Helper to preserve all params and tab
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

  const handleConfirm = (id: number) => () => {
    router.push(getActionUrl("confirm", id));
  };

  const handleEdit = (id: number) => () => {
    router.push(getActionUrl("edit", id));
  };

  const handleReject = (id: number) => () => {
    const params = new URLSearchParams(
      Array.from(config.searchParams?.entries?.() || [])
    );
    params.set("action", "reject");
    params.set("id", id.toString());
    if (!params.get("tab") && config.currentTab) {
      params.set("tab", config.currentTab);
    }
    router.push(`?${params.toString()}`);
  };

  const isPendingStatus = (status: string | undefined) => {
    if (!status) return false;
    const lowercaseStatus = status.toLowerCase();
    return lowercaseStatus === "chưa duyệt" || lowercaseStatus === "pending";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if user has KHOA role for edit/delete permissions

  // const isKhoaRole = role === "KHOA";
  const handleDelete =
    (id: number, certificateName: string, studentName: string) => () => {
      const params = new URLSearchParams(
        Array.from(config.searchParams?.entries?.() || [])
      );
      params.set("action", "delete");
      params.set("id", id.toString());
      params.set("certificateName", encodeURIComponent(certificateName));
      params.set("studentName", encodeURIComponent(studentName));
      if (!params.get("tab") && config.currentTab) {
        params.set("tab", config.currentTab);
      }
      router.push(`?${params.toString()}`);
    };

  // const handleEdit = (id: number) => () => {
  //   router.push(`?action=edit&id=${id}`);
  // };

  const columns: ColumnDef<Certificate>[] = [];
  if (role === "PDT" || role === "KHOA") {
    columns.push({
      id: "select",
      header: ({ table }) => {
        const rows = table.getRowModel().rows;
        return (
          <TableSelectAllCheckbox
            rows={rows}
            isRowSelectable={(row) =>
              config.currentTab !== "all"
                ? true
                : isPendingStatus(row.original.status)
            }
            getIsSelected={(row) => row.getIsSelected?.()}
            toggleSelected={(row, checked) => row.toggleSelected?.(checked)}
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          checked={!!row.getIsSelected?.()}
          disabled={
            config.currentTab === "all" && !isPendingStatus(row.original.status)
          }
          onCheckedChange={row.getToggleSelectedHandler?.()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 32,
      maxSize: 32,
    });
  }
  columns.push(
    {
      id: "STT",
      accessorKey: "id",
      header: t("common.stt"),
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "nameStudent",
      header: t("certificates.nameStudent"),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("nameStudent")}</div>
      ),
    },
    {
      accessorKey: "certificateName",
      header: t("certificates.certificateName"),
      cell: ({ row }) => (
        <div
          className="max-w-[300px] truncate"
          title={row.getValue("certificateName")}
        >
          {row.getValue("certificateName")}
        </div>
      ),
    },
    {
      accessorKey: "className",
      header: t("certificates.className"),
    },
    {
      accessorKey: "department",
      header: t("certificates.department"),
      cell: ({ row }) => (
        <div
          className="max-w-[150px] truncate"
          title={row.getValue("department")}
        >
          {row.getValue("department")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("certificates.status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        const getStatusDisplay = (status: string) => {
          switch (status?.toLowerCase()) {
            case "active":
              return t("certificates.statusActive");
            case "inactive":
              return t("certificates.statusInactive");
            case "pending":
              return t("certificates.statusPending");
            case "draft":
              return t("certificates.statusDraft");
            case "verified":
              return t("certificates.statusVerified");
            default:
              return status || t("common.unknown");
          }
        };

        const getStatusColor = (status: string) => {
          switch (status?.toLowerCase()) {
            case "đã duyệt":
              return "bg-green-100 text-green-800";
            case "chưa duyệt":
              return "bg-blue-100 text-blue-800";
            case "đã từ chối":
              return "bg-red-100 text-red-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };

        return (
          <div className="max-w-[120px] truncate">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {getStatusDisplay(status)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "diploma_number",
      header: t("certificates.diplomaNumber"),
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.getValue("diploma_number")}
        </div>
      ),
    },
    {
      accessorKey: "issueDate",
      header: t("certificates.issueDate"),
      cell: ({ row }) => {
        const date = row.getValue("issueDate") as string;
        return formatDate(date);
      },
    },
    {
      accessorKey: "createdAt",
      header: t("common.createdAt"),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return formatDateTime(date);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`h-8 w-8 p-0 cursor-pointer ${
                  row.getIsSelected() ? "bg-brand-10 rounded-full" : ""
                }`}
              >
                <span className="sr-only">{t("common.actions")}</span>
                <MoreHorizontal
                  className={`h-4 w-4 hover:bg-brand-10 hover:rounded-full ${
                    row.getIsSelected() ? "text-brand-60" : ""
                  }`}
                />
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
                    <DropdownMenuItem
                      onClick={handleReject(row.original.id)}
                      className=" hover:bg-red-100 focus:bg-red-100"
                    >
                      <X className="mr-2 h-4 w-4 text-red-600" />
                      <span className="text-red-600">
                        {t("certificates.rejectAction")}
                      </span>
                    </DropdownMenuItem>
                  </>
                )}
              {role === "KHOA" &&
                row.original.status?.toLowerCase() === "chưa duyệt" && (
                  <>
                    <DropdownMenuItem onClick={handleEdit(row.original.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t("common.edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleDelete(
                        row.original.id,
                        row.original.certificateName,
                        row.original.nameStudent
                      )}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      {t("common.delete")}
                    </DropdownMenuItem>
                  </>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  );

  return columns;
}
