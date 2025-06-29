import { Transaction } from "@/models/transaction";
import { ColumnDef } from "@tanstack/react-table";
import { CopyableCell } from "@/components/ui/copyable-cell";
import dayjs from "@/libs/dayjs";

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

export const useColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "hash",
    header: "Transaction Hash",
    cell: ({ row }) => (
      <CopyableCell
        value={row.original.hash}
        display={
          <span className="text-[#5caad9] hover:text-[#0284c2] hover:font-medium hover:cursor-pointer">
            {shortenHash(row.original.hash, 10)}
          </span>
        }
        tooltipLabel="Copy Transaction Hash"
        iconSize={16}
        iconClassName="text-gray-400"
      />
    ),
  },
  {
    accessorKey: "blockNum",
    header: "Block",
    cell: ({ row }) => (
      <span className="text-[#5caad9] hover:text-[#0284c2] hover:font-medium cursor-pointer">
        {parseInt(row.original.blockNum, 16)}
      </span>
    ),
  },
  {
    accessorKey: "blockTimestamp",
    header: "Age",
    cell: ({ row }) => formatDate(row.original.blockTimestamp),
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => (
      <CopyableCell
        value={row.original.from}
        display={
          <span className="text-[#5caad9] hover:text-[#0284c2] hover:font-medium cursor-pointer">
            {shortenAddress(row.original.from, 6)}
          </span>
        }
        tooltipLabel="Copy From"
        iconSize={16}
        iconClassName="text-gray-400"
      />
    ),
  },
  {
    accessorKey: "to",
    header: "To",
    cell: ({ row }) => (
      <CopyableCell
        value={row.original.to}
        display={
          <span className="text-[#5caad9] hover:text-[#0284c2] hover:font-medium cursor-pointer">
            {shortenAddress(row.original.to, 6)}
          </span>
        }
        tooltipLabel="Copy To"
        iconSize={16}
        iconClassName="text-gray-400"
      />
    ),
  },
  {
    accessorKey: "direction",
    header: "Direction",
    cell: ({ row }) => (
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
    accessorKey: "value",
    header: "Amount",
    cell: ({ row }) => `${row.original.value} ${row.original.asset}`,
  },
  {
    accessorKey: "transactionFee",
    header: "Txn Fee",
    cell: ({ row }) => Number(row.original.transactionFee) / 1e18,
  },
];
