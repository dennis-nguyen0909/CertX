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
import { MoreHorizontal, Eye } from "lucide-react";
import { Student } from "@/models/student";
import { Badge } from "@/components/ui/badge";
import { CopyableCell } from "@/components/ui/copyable-cell";
import { formatPublicKey } from "@/utils/text";

export const useColumns = (t: TFunction) => {
  const router = useRouter();

  const handleView =
    (id: number, studentName: string, stuCoin: string) => () => {
      router.push(
        `?action=reward&id=${id}&studentName=${studentName}&currentCoin=${stuCoin}`
      );
    };

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
      accessorKey: "className",
      header: t("student.className"),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("className")}</Badge>
      ),
    },
    {
      accessorKey: "stuCoin",
      header: t("student.coin"),
      cell: ({ row }) => (
        <Badge variant="outline">{parseFloat(row.original.stuCoin + "")}</Badge>
      ),
    },
    {
      accessorKey: "walletAddress",
      header: t("student.walletAddress"),
      cell: ({ row }) => (
        <CopyableCell
          display={
            <span className="text-gray-600 font-mono text-sm break-all">
              {formatPublicKey(row.original?.walletAddress, 8)}
            </span>
          }
          value={row.original.walletAddress ?? ""}
          tooltipLabel={t("student.walletAddress")}
        />
      ),
    },
  ];

  const columns: ColumnDef<Student>[] = [
    ...baseColumns,
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
              <DropdownMenuItem
                onClick={handleView(
                  row.original.id,
                  row.original.name,
                  row.original.stuCoin + ""
                )}
              >
                <Eye className="mr-2 h-4 w-4" />
                {t("common.reward")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
    },
  ];

  return columns;
};
