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
  Clock,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import {
  useUnlockPermissionUpdate,
  useUnlockPermissionDelete,
} from "@/hooks/permission/use-unlock-permision-read";
import { useUnlockPermissionWrite } from "@/hooks/permission/use-unlock-permision-write";
import { toast } from "sonner";
import { useDepartmentDelete } from "@/hooks/user/use-department-delete";
import React, { useState } from "react";

interface Department {
  id: number;
  name: string;
  email: string;
  permissions: string[];
  locked: boolean;
}

const TransparentFullScreenOverlay: React.FC<{ message?: string }> = ({
  message,
}) => (
  <div
    style={{
      position: "fixed",
      zIndex: 9999,
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(255,255,255,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "all",
    }}
    className="backdrop-blur-[2px]"
  >
    <div className="flex flex-col items-center">
      <svg
        className="animate-spin h-10 w-10 text-brand-60 mb-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
      <span className="text-brand-60 text-lg font-medium">
        {message || "Đang cập nhật..."}
      </span>
    </div>
  </div>
);

export const useColumns = (
  t: TFunction,
  refetch: () => void,
  departmentName?: string
) => {
  const router = useRouter();
  // const { mutate: unlockRead, isPending: isLoadingRead } =
  //   useUnlockPermissionRead();
  const { mutate: unlockWrite, isPending: isLoadingWrite } =
    useUnlockPermissionWrite();
  const { mutate: unlockUpdate, isPending: isLoadingUpdate } =
    useUnlockPermissionUpdate();
  const { mutate: unlockDelete, isPending: isLoadingDelete } =
    useUnlockPermissionDelete();
  const { mutate: deleteDepartment } = useDepartmentDelete();

  const [updating, setUpdating] = useState(false);

  const isUpdating =
    // isLoadingRead ||
    isLoadingWrite || isLoadingUpdate || isLoadingDelete || updating;

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
    setUpdating(true);
    // Comment lại quyền READ
    // if (permission === "READ") {
    //   unlockRead(
    //     { id },
    //     {
    //       onSuccess: async () => {
    //         await refetch();
    //         toast.success(t("common.success"), {
    //           description: t("department.updatePermissionSuccess"),
    //           icon: <CircleCheck className="text-green-500 w-5 h-5" />,
    //         });
    //         setUpdating(false);
    //       },
    //       onError: () => setUpdating(false),
    //     }
    //   );
    // } else
    if (permission === "CREATE") {
      unlockWrite(
        { id },
        {
          onSuccess: async () => {
            await refetch();
            toast.success(t("common.success"), {
              description: t("department.updatePermissionSuccess"),
              icon: <CircleCheck className="text-green-500 w-5 h-5" />,
            });
            setUpdating(false);
          },
          onError: () => setUpdating(false),
        }
      );
    } else if (permission === "UPDATE") {
      unlockUpdate(
        { id },
        {
          onSuccess: async () => {
            await refetch();
            toast.success(t("common.success"), {
              description: t("department.updatePermissionSuccess"),
              icon: <CircleCheck className="text-green-500 w-5 h-5" />,
            });
            setUpdating(false);
          },
          onError: () => setUpdating(false),
        }
      );
    } else if (permission === "DELETE") {
      unlockDelete(
        { id },
        {
          onSuccess: async () => {
            await refetch();
            toast.success(t("common.success"), {
              description: t("department.updatePermissionSuccess"),
              icon: <CircleCheck className="text-green-500 w-5 h-5" />,
            });
            setUpdating(false);
          },
          onError: () => setUpdating(false),
        }
      );
    } else {
      setUpdating(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    deleteDepartment(id, {
      onSuccess: async () => {
        await refetch();
        toast.success(
          t("common.deleteSuccess", { itemName: t("department.name") })
        );
        router.push("/department-list");
      },
    });
  };

  const handleCancelDelete = () => {
    router.push("/department-list");
  };

  const handleViewHistory = (id: number, name?: string) => () => {
    router.push(
      `/history?departmentId=${id}${
        name ? `&departmentName=${encodeURIComponent(name)}` : ""
      }`
    );
  };

  const handleOpenClassList = (id: number, name: string) => () => {
    router.push(
      `/department/${id}/classes?departmentName=${encodeURIComponent(name)}`
    );
  };

  // Overlay is rendered at the top level of the table (not inside each cell)
  // So, consumer of useColumns should render overlay if isUpdating is true
  // But for this hook, we expose isUpdating and overlay component for easy use

  const Overlay = isUpdating ? (
    <TransparentFullScreenOverlay
      message={t("department.updating", "Đang cập nhật...")}
    />
  ) : null;

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
          {/* Comment lại quyền READ */}
          {/* <div className="flex items-center space-x-2">
            <Switch
              id={`read-${row.original.id}`}
              checked={row.original.permissions.includes("READ")}
              onCheckedChange={() =>
                handlePermissionChange(row.original.id, "READ")
              }
              disabled={isUpdating}
            />
            <label htmlFor={`read-${row.original.id}`} className="text-sm">
              READ
            </label>
          </div> */}
          <div className="flex items-center space-x-2">
            <Switch
              id={`create-${row.original.id}`}
              checked={row.original.permissions.includes("CREATE")}
              onCheckedChange={() =>
                handlePermissionChange(row.original.id, "CREATE")
              }
              disabled={isUpdating}
            />
            <label htmlFor={`create-${row.original.id}`} className="text-sm">
              CREATE
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id={`update-${row.original.id}`}
              checked={row.original.permissions.includes("UPDATE")}
              onCheckedChange={() =>
                handlePermissionChange(row.original.id, "UPDATE")
              }
              disabled={isUpdating}
            />
            <label htmlFor={`update-${row.original.id}`} className="text-sm">
              UPDATE
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id={`delete-${row.original.id}`}
              checked={row.original.permissions.includes("DELETE")}
              onCheckedChange={() =>
                handlePermissionChange(row.original.id, "DELETE")
              }
              disabled={isUpdating}
            />
            <label htmlFor={`delete-${row.original.id}`} className="text-sm">
              DELETE
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
                  className={`h-8 w-8 p-0 cursor-pointer ${
                    row.getIsSelected() ? "bg-brand-10 rounded-full" : ""
                  }`}
                  disabled={isUpdating}
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
                  onClick={handleEdit(row.original)}
                  disabled={isUpdating}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleViewHistory(
                    row.original.id,
                    departmentName || row.original.name
                  )}
                  disabled={isUpdating}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {t("common.viewHistory", "Xem lịch sử")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleOpenClassList(
                    row.original.id,
                    row.original.name
                  )}
                  disabled={isUpdating}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Danh sách lớp
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleChangePassword(
                    row.original.id,
                    row.original.name || t("common.unknown")
                  )}
                  disabled={isUpdating}
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
                  disabled={isUpdating}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  {row.original.locked
                    ? t("department.unlock")
                    : t("department.lock")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleDelete(
                    row.original.id,
                    row.original.name || t("common.unknown")
                  )}
                  disabled={isUpdating}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {t("common.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  // Return overlay so consumer can render it at the top level of the page
  return {
    columns,
    handleConfirmDelete,
    handleCancelDelete,
    Overlay,
    isUpdating,
  };
};
