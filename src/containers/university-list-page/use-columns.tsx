import { University } from "@/models/university";
import { Image } from "antd";
import { Button } from "@/components/ui/button";
import { Eye, Unlock, Lock, Building2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function useUniversityColumns(
  t: (key: string, defaultText?: string) => string,
  onViewDetail: (id: string) => void,
  onToggleLock: (id: number, name: string, locked: boolean) => void,
  onViewDepartments: (id: number) => void
) {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: { row: { original: University } }) => row.original.id,
    },
    {
      accessorKey: "name",
      header: t("university.name", "Tên trường"),
      cell: ({ row }: { row: { original: University } }) => row.original.name,
    },
    {
      accessorKey: "email",
      header: t("university.email", "Email"),
      cell: ({ row }: { row: { original: University } }) => row.original.email,
    },
    {
      accessorKey: "address",
      header: t("university.address", "Địa chỉ"),
      cell: ({ row }: { row: { original: University } }) =>
        row.original.address,
    },
    {
      accessorKey: "taxCode",
      header: t("university.taxCode", "Mã số thuế"),
      cell: ({ row }: { row: { original: University } }) =>
        row.original.taxCode,
    },
    {
      accessorKey: "website",
      header: t("university.website", "Website"),
      cell: ({ row }: { row: { original: University } }) => (
        <a
          href={row.original.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {row.original.website}
        </a>
      ),
    },
    {
      accessorKey: "logo",
      header: t("university.logo", "Logo"),
      cell: ({ row }: { row: { original: University } }) => (
        <Image
          src={row.original.logo}
          width={50}
          height={50}
          alt={row.original.name}
          className="h-10 w-10 object-contain rounded bg-white border"
        />
      ),
    },
    {
      id: "actions",
      header: t("common.actions", "Thao tác"),
      cell: ({ row }: { row: { original: University } }) => (
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onViewDetail(String(row.original.id ?? ""))}
                  title={t("common.viewDetail", "Xem chi tiết")}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("common.viewDetail", "Xem chi tiết")}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    onToggleLock(
                      row.original.id ?? 0,
                      row.original.name,
                      !!row.original.locked
                    )
                  }
                  title={
                    row.original.locked
                      ? t("common.unlock", "Mở khóa")
                      : t("common.lock", "Khóa")
                  }
                >
                  {row.original.locked ? (
                    <Unlock className="w-4 h-4 text-green-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-red-500" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {row.original.locked
                  ? t("common.unlock", "Mở khóa")
                  : t("common.lock", "Khóa")}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onViewDepartments(row.original.id ?? 0)}
                  title={t("university.viewDepartments", "Xem danh sách khoa")}
                >
                  <Building2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("university.viewDepartments", "Xem danh sách khoa")}
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
  ];
}
