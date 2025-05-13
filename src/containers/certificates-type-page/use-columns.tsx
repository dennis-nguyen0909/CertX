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
import { MoreHorizontal, Trash, Edit } from "lucide-react";
import { useState } from "react";
import { NotificationDelete } from "@/components/notification-delete";
import { CertificateType } from "@/models/certificates-type";

interface DeleteDialogState {
  isOpen: boolean;
  certificateTypeId?: number;
  certificateTypeName?: string;
}

export const useColumns = (t: TFunction, refetch: () => void) => {
  const router = useRouter();
  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(
    {
      isOpen: false,
    }
  );

  const handleDelete = (id: number, name: string) => () => {
    setDeleteDialogState({
      isOpen: true,
      certificateTypeId: id,
      certificateTypeName: name,
    });
  };

  const handleEdit = (id: number) => () => {
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

  const columns: ColumnDef<CertificateType>[] = [
    {
      id: "STT",
      accessorKey: "id",
      header: t("common.stt"),
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: t("certificatesType.name"),
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
                    row.original.name || t("common.unknown")
                  )}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {t("common.delete")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit(row.original.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("common.edit")}
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
                deleteDialogState.certificateTypeName || t("common.unknown")
              }
            />
          </>
        );
      },
    },
  ];

  return columns;
};
