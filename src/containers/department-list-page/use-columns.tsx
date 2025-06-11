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
import {
  MoreHorizontal,
  Trash,
  Edit,
  CircleCheck,
  Lock,
  UserX,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useUnlockPermissionRead } from "@/hooks/permission/use-unlock-permision-read";
import { useUnlockPermissionWrite } from "@/hooks/permission/use-unlock-permision-write";
import { toast } from "sonner";
import { useDepartmentDelete } from "@/hooks/user/use-department-delete";

interface Department {
  id: number;
  name: string;
  email: string;
  permissions: string[];
  locked: boolean;
}

export const useColumns = (t: TFunction, refetch: () => void) => {
  const router = useRouter();
  const { mutate: unlockRead } = useUnlockPermissionRead();
  const { mutate: unlockWrite } = useUnlockPermissionWrite();
  const { mutate: deleteDepartment } = useDepartmentDelete();

  const handleDelete = (id: number, name: string) => () => {
    router.push(`?action=delete&id=${id}&name=${encodeURIComponent(name)}`);
  };

  const handleEdit = (department: Department) => () => {
    router.push(
      `?action=edit&id=${department.id}&name=${encodeURIComponent(
        department.name
      )}&email=${encodeURIComponent(department.email)}`
    );
  };

  const handleChangePassword = (id: number, name: string) => () => {
    router.push(
      `?action=change-password&id=${id}&name=${encodeURIComponent(name)}`
    );
  };

  const handleLock = (id: number, name: string, locked: boolean) => () => {
    router.push(
      `?action=lock&id=${id}&name=${encodeURIComponent(name)}&locked=${locked}`
    );
  };

  const handlePermissionChange = (id: number, permission: string) => {
    if (permission === "READ") {
      unlockRead(
        { id },
        {
          onSuccess: async () => {
            refetch();
            toast.success(t("common.success"), {
              description: t("department.updatePermissionSuccess"),
              icon: <CircleCheck className="text-green-500 w-5 h-5" />,
            });
          },
        }
      );
    } else if (permission === "WRITE") {
      unlockWrite(
        { id },
        {
          onSuccess: () => {
            refetch();
            toast.success(t("common.success"), {
              description: t("department.updatePermissionSuccess"),
              icon: <CircleCheck className="text-green-500 w-5 h-5" />,
            });
          },
        }
      );
    }
  };

  const handleConfirmDelete = async (id: string) => {
    deleteDepartment(id, {
      onSuccess: async () => {
        await refetch();
        toast.success(t("common.success"), {
          description: t("department.deleteSuccess"),
          icon: <CircleCheck className="text-green-500 w-5 h-5" />,
        });
        router.push("/department-list");
      },
    });
  };

  const handleCancelDelete = () => {
    router.push("/department-list");
  };

  const columns: ColumnDef<Department>[] = [
    {
      id: "STT",
      accessorKey: "id",
      header: t("common.stt"),
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: t("department.name"),
    },
    {
      accessorKey: "email",
      header: t("common.email"),
    },
    {
      accessorKey: "permissions",
      header: t("common.permissions"),
      cell: ({ row }) => (
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id={`read-${row.original.id}`}
              checked={row.original.permissions.includes("READ")}
              onCheckedChange={() =>
                handlePermissionChange(row.original.id, "READ")
              }
            />
            <label htmlFor={`read-${row.original.id}`} className="text-sm">
              READ
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id={`write-${row.original.id}`}
              checked={row.original.permissions.includes("WRITE")}
              onCheckedChange={() =>
                handlePermissionChange(row.original.id, "WRITE")
              }
            />
            <label htmlFor={`write-${row.original.id}`} className="text-sm">
              WRITE
            </label>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "locked",
      header: t("department.status"),
      cell: ({ row }) => (
        <div
          className={`text-sm ${
            row.original.locked ? "text-red-500" : "text-green-500"
          }`}
        >
          {row.original.locked
            ? t("department.isLocked")
            : t("department.isActive")}
        </div>
      ),
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
                <DropdownMenuItem onClick={handleEdit(row.original)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleChangePassword(
                    row.original.id,
                    row.original.name || t("common.unknown")
                  )}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {t("department.changePassword")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLock(
                    row.original.id,
                    row.original.name || t("common.unknown"),
                    row.original.locked
                  )}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  {row.original.locked
                    ? t("department.unlock")
                    : t("department.lock")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return { columns, handleConfirmDelete, handleCancelDelete };
};
