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
import { MoreHorizontal, Trash, Edit, Users } from "lucide-react";
import { Class } from "@/models/class";

export const useColumns = (t: TFunction) => {
  const router = useRouter();

  const handleDelete = (id: number, className: string) => () => {
    router.push(
      `?action=delete&id=${id}&className=${encodeURIComponent(className)}`
    );
  };

  const handleEdit = (id: number) => () => {
    router.push(`?action=edit&id=${id}`);
  };

  const handleViewStudents = (className: string) => () => {
    router.push(`/class/${encodeURIComponent(className)}/students`);
  };

  const columns: ColumnDef<Class>[] = [
    {
      id: "STT",
      accessorKey: "id",
      header: t("common.stt"),
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "className",
      header: t("class.className"),
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
              <DropdownMenuItem
                onClick={handleViewStudents(
                  row.original.className || t("common.unknown")
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                {t("class.viewStudents")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit(row.original.id)}>
                <Edit className="mr-2 h-4 w-4" />
                {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={handleDelete(
                  row.original.id,
                  row.original.className || t("common.unknown")
                )}
              >
                <Trash className="mr-2 h-4 w-4" />
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
