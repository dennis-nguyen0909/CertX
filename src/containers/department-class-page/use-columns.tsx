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
import { Users, MoreHorizontal, Edit, Trash } from "lucide-react";
import { Class } from "@/models/class";

export const useColumns = (t: TFunction) => {
  const router = useRouter();

  const handleViewStudents = (className: string) => () => {
    router.push(`/class/${encodeURIComponent(className)}/students`);
  };

  const handleEdit = (classData: Class) => () => {
    router.push(
      `?action=edit&id=${classData.id}&className=${encodeURIComponent(
        classData.className || ""
      )}`
    );
  };

  const handleDelete = (id: number, className: string) => () => {
    router.push(
      `?action=delete&id=${id}&className=${encodeURIComponent(className)}`
    );
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
      header: "",
      cell: ({ row }) => (
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
            <DropdownMenuItem
              onClick={handleViewStudents(row.original.className)}
            >
              <Users className="mr-2 h-4 w-4" />
              {t("class.viewStudents")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit(row.original)}>
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
      ),
    },
  ];

  return columns;
};
