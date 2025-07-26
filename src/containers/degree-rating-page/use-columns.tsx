import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { Rating } from "@/models/rating";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useRatingColumns = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const handleDelete = (id: number, name: string) => () => {
    router.push(`?action=delete&id=${id}&name=${name}`);
  };
  const role = useSelector((state: RootState) => state.user.role);

  const handleEdit = (id: number, name: string) => () => {
    router.push(`?action=edit&id=${id}&name=${name}`);
  };
  const columns = [
    {
      id: "STT",
      accessorKey: "id",
      header: t("common.stt"),
      cell: ({ row }: { row: Row<Rating> }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: t("degrees.ratingName"),
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row<Rating> }) => {
        // Only allow edit/delete for role === "PDT"
        if (role !== "PDT") {
          return null;
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`h-8 w-8 p-0 cursor-pointer ${
                  row.getIsSelected?.() ? "bg-brand-10 rounded-full" : ""
                }`}
              >
                <span className="sr-only">{t("common.actions")}</span>
                <MoreHorizontal
                  className={`h-4 w-4 hover:bg-brand-10 hover:rounded-full ${
                    row.getIsSelected?.() ? "text-brand-60" : ""
                  }`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleEdit(row.original.id, row.original.name)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={handleDelete(row.original.id, row.original.name)}
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
