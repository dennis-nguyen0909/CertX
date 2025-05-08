"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Department } from "@/models/departments";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useDepartmentsDelete } from "@/hooks/departments/use-departments-delete";
import { useToast } from "@/components/ui/use-toast";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { TFunction } from "i18next";

export const useColumns = (t: TFunction) => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: deleteDepartment } = useDepartmentsDelete();

  const columns: ColumnDef<Department>[] = [
    {
      accessorKey: "name",
      header: t("departments.name"),
    },
    {
      accessorKey: "code",
      header: t("departments.code"),
    },
    {
      accessorKey: "description",
      header: t("departments.description"),
    },
    {
      accessorKey: "status",
      header: t("departments.status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {t(
              `departments.status${
                status.charAt(0).toUpperCase() + status.slice(1)
              }`
            )}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("common.createdAt"),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return dayjs(date).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      accessorKey: "updatedAt",
      header: t("common.updatedAt"),
      cell: ({ row }) => {
        const date = row.getValue("updatedAt") as string;
        return dayjs(date).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const department = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/departments?action=edit&id=${department.id}`);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (
                    window.confirm(
                      t("common.deleteConfirmation", {
                        itemName: department.name,
                      })
                    )
                  ) {
                    deleteDepartment(department.id, {
                      onSuccess: () => {
                        toast({
                          title: t("common.deleteSuccessTitle"),
                          description: t("departments.deleteSuccess"),
                        });
                        queryClient.invalidateQueries({
                          queryKey: ["departments"],
                        });
                      },
                      onError: () => {
                        toast({
                          title: t("common.deleteErrorTitle"),
                          description: t("departments.deleteError"),
                          variant: "destructive",
                        });
                      },
                    });
                  }
                }}
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
