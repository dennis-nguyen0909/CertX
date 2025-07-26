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
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { EducationMode } from "@/models/education-mode";

export const useColumns = (t: TFunction) => {
  const router = useRouter();

  const handleDelete = (id: number, name: string) => () => {
    router.push(`?action=delete&id=${id}&name=${encodeURIComponent(name)}`);
  };

  const handleEdit = (id: number, name: string) => () => {
    router.push(`?action=edit&id=${id}&name=${encodeURIComponent(name)}`);
  };

  const role = useSelector((state: RootState) => state.user.role);
  const columns: ColumnDef<EducationMode>[] = [
    {
      id: "STT",
      accessorKey: "id",
      header: t("common.stt"),
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: t("degrees.educationModeName"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        if (role !== "PDT") return null;
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
            {role === "PDT" && (
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
                <DropdownMenuItem
                  onClick={handleEdit(row.original.id, row.original.name)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
