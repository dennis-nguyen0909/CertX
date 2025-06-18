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
import { useColumns } from "./columns";
import { useState } from "react";
import { useDegreeTitleList } from "@/hooks/degree/use-degree-title-list";

export default function DegreeRatingPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const [search, setSearch] = useState<string>("");

  const {
    data: listData,
    isLoading: isLoadingListData,
    error,
    isError,
  } = useDegreeTitleList({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    name: search,
  });

  const columns = useColumns(t);

  // Handle error state
  if (isError) {
    console.error("Error loading degree titles:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("nav.degreeTitle")}</h1>
      </div>
      <div className="flex flex-row gap-4">
        <div className="relative w-1/4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("degrees.titleName")}
            className="pl-8"
          />
        </div>
        <Select onValueChange={() => {}}>
          <SelectTrigger>
            <SelectValue placeholder={t("common.sort")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t("degrees.titleName")}</SelectItem>
            <SelectItem value="created_at">{t("common.createdAt")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={Array.isArray(listData) ? listData : listData?.items || []}
        onPaginationChange={setPagination}
        listMeta={Array.isArray(listData) ? undefined : listData?.meta}
        containerClassName="flex-1"
        isLoading={isLoadingListData && !isError}
      />
    </div>
  );
}
