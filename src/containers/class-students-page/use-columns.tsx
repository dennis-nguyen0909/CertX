import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { TFunction } from "i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash, Edit, Eye } from "lucide-react";
import { Student } from "@/models/student";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { format } from "date-fns";

export const useColumns = (t: TFunction) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = useSelector((state: RootState) => state.user.role);

  // Helper to build action URLs with all current searchParams, updating action/id/name as needed
  const getActionUrl = (action: string, id: number, name?: string) => {
    // Use the latest search params from the URL, not from config
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("action", action);
    params.set("id", String(id));
    if (action === "delete" && name) {
      params.set("name", encodeURIComponent(name));
    } else {
      params.delete("name");
    }
    return `?${params.toString()}`;
  };

  const handleDelete = (id: number, name: string) => () => {
    router.push(getActionUrl("delete", id, name));
  };

  const handleEdit = (id: number) => () => {
    router.push(getActionUrl("edit", id));
  };

  const handleView = (id: number) => () => {
    router.push(getActionUrl("view", id));
  };

  const columns: ColumnDef<Student>[] = [
    {
      id: "STT",
      accessorKey: "id",
      header: t("common.stt"),
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: t("student.name"),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "studentCode",
      header: t("student.studentCode"),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue("studentCode")}
        </Badge>
      ),
    },
    {
      accessorKey: "email",
      header: t("student.email"),
      cell: ({ row }) => (
        <div className="text-blue-600 underline">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "course",
      header: t("student.course"),
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("course")}</Badge>
      ),
    },
    {
      accessorKey: "birthDate",
      header: t("student.birthDate"),
      cell: ({ row }) => {
        const date = row.getValue("birthDate") as string;
        return (
          <div className="text-sm">
            {date ? format(new Date(date), "dd/MM/yyyy") : ""}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
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
              {role === "PDT" && (
                <>
                  <DropdownMenuItem onClick={handleEdit(row.original.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t("common.edit")}
                  </DropdownMenuItem>
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
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
    },
  ];

  return columns;
};
