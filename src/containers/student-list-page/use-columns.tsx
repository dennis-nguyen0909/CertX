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
import { Student } from "@/models/student";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { format } from "date-fns";

export const useColumns = (t: TFunction) => {
  const router = useRouter();

  const handleDelete = (id: number, name: string) => () => {
    router.push(`?action=delete&id=${id}&name=${encodeURIComponent(name)}`);
  };

  const handleEdit = (id: number) => () => {
    router.push(`?action=edit&id=${id}`);
  };

  const handleView = (id: number) => () => {
    router.push(`?action=view&id=${id}`);
  };
  const role = useSelector((state: RootState) => state.user.role);

  const baseColumns: ColumnDef<Student>[] = [
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
      accessorKey: "className",
      header: t("student.className"),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("className")}</Badge>
      ),
    },
  ];

  // Conditionally add departmentName column if role is not KHOA
  if (role !== "KHOA") {
    baseColumns.push({
      accessorKey: "departmentName",
      header: t("student.departmentName"),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("departmentName")}
        </div>
      ),
    });
  }

  const columns: ColumnDef<Student>[] = [
    ...baseColumns,
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
          <div className="text-sm">{format(new Date(date), "dd/MM/yyyy")}</div>
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
