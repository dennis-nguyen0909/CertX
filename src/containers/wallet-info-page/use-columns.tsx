import { Transaction } from "@/models/transaction";
import { ColumnDef } from "@tanstack/react-table";
import { CopyableCell } from "@/components/ui/copyable-cell";
import dayjs from "@/libs/dayjs";
import { TFunction } from "i18next";

function shortenHash(str: string, len = 10) {
  if (!str) return "";
  return str.length <= len ? str : str.slice(0, len) + "...";
}

function shortenAddress(str: string, len = 6) {
  if (!str) return "";
  return str.length <= len * 2 + 3
    ? str
    : str.slice(0, len) + "..." + str.slice(-len);
}

function formatDate(date: string) {
  return dayjs(date).fromNow();
}

export const useColumns = (t: TFunction): ColumnDef<Transaction>[] => {
  return [
    {
      accessorKey: "hash",
      header: t("wallet.transactionHash"),
      cell: ({ row }: { row: { original: Transaction } }) => (
        <CopyableCell
          value={row.original.hash}
          display={
            <a
              href={`https://sepolia.etherscan.io/tx/${row.original.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5caad9] hover:text-[#0284c2] hover:font-medium cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              {shortenHash(row.original.hash, 10)}
            </a>
          }
          tooltipLabel={t("wallet.copyTransactionHash")}
          iconSize={16}
          iconClassName="text-gray-400"
        />
      ),
    },
    {
      accessorKey: "blockNum",
      header: t("wallet.block"),
      cell: ({ row }: { row: { original: Transaction } }) => (
        <a
          href={`https://sepolia.etherscan.io/block/${parseInt(
            row.original.blockNum,
            16
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5caad9] hover:text-[#0284c2] hover:font-medium cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          {parseInt(row.original.blockNum, 16)}
        </a>
      ),
    },
    {
      accessorKey: "blockTimestamp",
      header: t("wallet.age"),
      cell: ({ row }: { row: { original: Transaction } }) =>
        formatDate(row.original.blockTimestamp),
    },
    {
      accessorKey: "from",
      header: t("wallet.from"),
      cell: ({ row }: { row: { original: Transaction } }) => (
        <CopyableCell
          value={row.original.from}
          display={
            <span className="text-[#5caad9] hover:text-[#0284c2] hover:font-medium cursor-pointer">
              {shortenAddress(row.original.from, 6)}
            </span>
          }
          tooltipLabel={t("wallet.copyFrom")}
          iconSize={16}
          iconClassName="text-gray-400"
        />
      ),
    },
    {
      accessorKey: "direction",
      header: "",
      size: 80,
      meta: { width: 80 },
      cell: ({ row }: { row: { original: Transaction } }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.original.direction === "IN"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.original.direction}
        </span>
      ),
    },
    {
      accessorKey: "to",
      header: t("wallet.to"),
      cell: ({ row }: { row: { original: Transaction } }) => (
        <CopyableCell
          value={row.original.to}
          display={
            <span className="text-[#5caad9] hover:text-[#0284c2] hover:font-medium cursor-pointer">
              {shortenAddress(row.original.to, 6)}
            </span>
          }
          tooltipLabel={t("wallet.copyTo")}
          iconSize={16}
          iconClassName="text-gray-400"
        />
      ),
    },
    {
      accessorKey: "value",
      header: t("wallet.amount"),
      cell: ({ row }: { row: { original: Transaction } }) =>
        `${row.original.value} ${row.original.asset}`,
    },
    {
      accessorKey: "transactionFee",
      header: t("wallet.txnFee"),
      cell: ({ row }: { row: { original: Transaction } }) =>
        Number(row.original.transactionFee) / 1e18,
    },
  ];
};
