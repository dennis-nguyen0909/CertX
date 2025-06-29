"use client";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./columns";
import { useDegreeTitleList } from "@/hooks/degree/use-degree-title-list";
import { useGuardRoute } from "@/hooks/use-guard-route";

export default function DegreeTitlePage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  useGuardRoute();

  const {
    data: listData,
    isLoading: isLoadingListData,
    error,
    isError,
  } = useDegreeTitleList({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
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
