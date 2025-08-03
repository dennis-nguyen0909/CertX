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
import { Checkbox } from "@/components/ui/checkbox";
import { TableSelectAllCheckbox } from "@/components/ui/table-select-all-checkbox";

export interface StudentColumnsConfig {
  t: TFunction;
  onView?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
  searchParams?: URLSearchParams;
}

export function useColumns(config: StudentColumnsConfig): ColumnDef<Student>[] {
  const router = useRouter();
  const t = config.t;
  const role = useSelector((state: RootState) => state.user.role);

  // Helper to build action URLs with searchParams
  const getActionUrl = (action: string, id: number, name?: string) => {
    const params = new URLSearchParams(
      Array.from(config.searchParams?.entries?.() || [])
    );
    params.set("action", action);
    params.set("id", id.toString());
    if (name) params.set("name", encodeURIComponent(name));
    return `?${params.toString()}`;
  };

  const handleDelete = (id: number, name: string) => () => {
    router.push(getActionUrl("delete", id, name));
    config.onDelete?.({ id } as Student);
  };

  const handleEdit = (id: number) => () => {
    router.push(getActionUrl("edit", id));
    config.onEdit?.({ id } as Student);
  };

  const handleView = (id: number) => () => {
    router.push(getActionUrl("view", id));
    config.onView?.({ id } as Student);
  };

  const columns: ColumnDef<Student>[] = [];

  // Thêm cột select nếu là PDT
  if (role === "PDT") {
    columns.push({
      id: "select",
      header: ({ table }) => {
        const rows = table.getRowModel().rows;
        return (
          <TableSelectAllCheckbox
            rows={rows}
            isRowSelectable={() => true}
            getIsSelected={(row) => row.getIsSelected?.()}
            toggleSelected={(row, checked) => row.toggleSelected?.(checked)}
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          checked={!!row.getIsSelected?.()}
          onCheckedChange={row.getToggleSelectedHandler?.()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 32,
      maxSize: 32,
    });
  }

  columns.push(
    {
      id: "STT",
      accessorKey: "id",
      header: t("common.stt"),
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      size: 48,
      maxSize: 48,
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
    }
  );

  // Conditionally add departmentName column if role is not KHOA
  if (role !== "KHOA") {
    columns.push({
      accessorKey: "departmentName",
      header: t("student.departmentName"),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("departmentName")}
        </div>
      ),
    });
  }

  columns.push(
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
      size: 48,
      maxSize: 48,
    }
  );

  return columns;
}
