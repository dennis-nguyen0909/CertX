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
import { MoreHorizontal, Trash, Edit, Eye } from "lucide-react";
import { Certificate } from "@/models/certificate";
import { useAuth } from "@/contexts/auth";

export const useColumns = (t: TFunction) => {
  const router = useRouter();
  const { role } = useAuth();

  const handleDelete = (id: number, name: string) => () => {
    router.push(`?action=delete&id=${id}&name=${encodeURIComponent(name)}`);
  };

  const handleEdit = (id: number) => () => {
    router.push(`?action=edit&id=${id}`);
  };

  const handleView = (id: number) => () => {
    router.push(`?action=view&id=${id}`);
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
  const isKhoaRole = role === "KHOA";

  const columns: ColumnDef<Certificate>[] = [
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
          className="max-w-[200px] truncate"
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
            case "active":
            case "verified":
              return "bg-green-100 text-green-800";
            case "inactive":
              return "bg-red-100 text-red-800";
            case "pending":
              return "bg-yellow-100 text-yellow-800";
            case "draft":
              return "bg-blue-100 text-blue-800";
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
                className={`h-8 w-8 p-0 ${
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
              {!isKhoaRole && (
                <>
                  <DropdownMenuItem onClick={handleEdit(row.original.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t("common.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleDelete(
                      row.original.id,
                      row.original.nameStudent || t("common.unknown")
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
    },
  ];

  return columns;
};
