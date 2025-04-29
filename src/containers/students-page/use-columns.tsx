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

interface Student {
  id: string;
  name: string;
  email: string;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

interface DeleteDialogState {
  isOpen: boolean;
  studentId?: string;
  studentName?: string;
  email?: string;
}

export const useColumns = (t: TFunction, refetch: () => void) => {
  const router = useRouter();
  const [deleteDialogState, setDeleteDialogState] = useState<DeleteDialogState>(
    {
      isOpen: false,
    }
  );

  const handleDelete = (id: string, name: string, email: string) => () => {
    setDeleteDialogState({
      isOpen: true,
      studentId: id,
      studentName: name,
      email,
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

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: t("common.name"),
    },
    {
      accessorKey: "email",
      header: t("common.email"),
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
                  <span className="sr-only">Open menu</span>
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
                    row.original.fullName ||
                      row.original.name ||
                      t("common.unknown"),
                    row.original.email || t("common.unknown")
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
                deleteDialogState.studentName ||
                deleteDialogState.email ||
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
