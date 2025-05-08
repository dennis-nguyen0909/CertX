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
import { MoreHorizontal, Trash, Edit, Flag } from "lucide-react";
import { useState } from "react";
import { NotificationDelete } from "@/components/notification-delete";
import { Certificate } from "@/models/certificates";

interface DeleteDialogState {
  isOpen: boolean;
  certificateId?: string;
  certificateName?: string;
  issuer?: string;
}

export const useColumns = (t: TFunction, refetch: () => void) => {
  const router = useRouter();
  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(
    {
      isOpen: false,
    }
  );

  const handleDelete = (id: string, name: string, issuer: string) => () => {
    setDeleteDialogState({
      isOpen: true,
      certificateId: id,
      certificateName: name,
      issuer,
    });
  };

  const handleEdit = (id: string) => () => {
    router.push(`?action=edit&id=${id}`);
  };

  const handleConfirmDelete = async () => {
    // TODO: Implement delete functionality
    setDeleteDialogState({ isOpen: false });
    refetch();
  };

  const handleCancelDelete = () => {
    setDeleteDialogState({ isOpen: false });
  };

  const columns: ColumnDef<Certificate>[] = [
    {
      accessorKey: "name",
      header: t("certificates.name"),
    },
    {
      accessorKey: "issuer",
      header: t("certificates.issuer"),
    },
    {
      accessorKey: "issueDate",
      header: t("certificates.issueDate"),
    },
    {
      accessorKey: "expiryDate",
      header: t("certificates.expiryDate"),
    },
    {
      accessorKey: "status",
      header: t("certificates.status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return t(
          `certificates.status${
            status.charAt(0).toUpperCase() + status.slice(1)
          }`
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("common.createdAt"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
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
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleDelete(
                    row.original.id,
                    row.original.name || t("common.unknown"),
                    row.original.issuer || t("common.unknown")
                  )}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {t("common.delete")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit(row.original.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit(row.original.id)}>
                  <Flag className="mr-2 h-4 w-4" />
                  {t("common.report")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NotificationDelete
              isOpen={deleteDialogState.isOpen}
              onOpenChange={(open: boolean) =>
                setDeleteDialogState({ ...deleteDialogState, isOpen: open })
              }
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
              itemName={
                deleteDialogState.certificateName ||
                deleteDialogState.issuer ||
                t("common.unknown")
              }
            />
          </>
        );
      },
    },
  ];

  return columns;
};
