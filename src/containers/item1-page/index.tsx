"use client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreateDialog } from "./components/create-dialog";
import { EditDialog } from "./components/edit-dialog";
import { useItem1List } from "@/hooks/item1/use-item1-list";

export default function Item1Page() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("name");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data, refetch } = useItem1List({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    name: debouncedSearch,
    sort: sort ? [sort] : undefined,
  });

  const columns = useColumns(t, refetch);

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    if (openEditDialog) {
      setIsEditDialogOpen(true);
    } else {
      setIsEditDialogOpen(false);
    }
  }, [openEditDialog, searchParams]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("item.management")}</h1>
        <CreateDialog />
      </div>
      <div className="flex flex-row gap-4">
        <div className="relative w-1/4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("item.searching")}
            className="pl-8"
          />
        </div>
        <Select onValueChange={(value) => setSort(value)}>
          <SelectTrigger className="focus:ring-[#f54e1e] focus:border-[#f54e1e] w-2-xs [&>svg]:text-[#f54e1e] !text-[#f54e1e] border-[#f54e1e]">
            <SelectValue
              placeholder={t("item.sort")}
              className="!text-[#f54e1e] !placeholder:text-[#f54e1e] font-medium"
            />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg rounded-md border border-gray-200">
            <SelectItem
              value="name"
              className="hover:bg-[#f54e1e]/10 focus:bg-[#f54e1e]/10 cursor-pointer"
            >
              {t("item.name")}
            </SelectItem>
            <SelectItem
              value="category"
              className="hover:bg-[#f54e1e]/10 focus:bg-[#f54e1e]/10 cursor-pointer"
            >
              {t("item.category")}
            </SelectItem>
            <SelectItem
              value="price"
              className="hover:bg-[#f54e1e]/10 focus:bg-[#f54e1e]/10 cursor-pointer"
            >
              {t("item.price")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={data?.items || []}
        onPaginationChange={setPagination}
        listMeta={{
          count: data?.meta.count || 0,
          per_page: data?.meta.per_page || 10,
          current_page: data?.meta.current_page || 1,
          total_pages: data?.meta.total_pages || 1,
          total: data?.meta.total || 0,
        }}
        containerClassName="flex-1"
      />

      {openEditDialog && searchParams.get("id") && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              // Reset URL parameters when closing dialog
              window.history.replaceState({}, "", window.location.pathname);
            }
          }}
          item={data?.items.find((item) => item.id === searchParams.get("id"))}
        />
      )}
    </div>
  );
}
