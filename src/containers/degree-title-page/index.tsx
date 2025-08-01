"use client";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./columns";
import { useDegreeTitleList } from "@/hooks/degree/use-degree-title-list";
import { useGuardRoute } from "@/hooks/use-guard-route";
import { CreateDegreeTitleDialog } from "./components/create-degree-title-dialog";
import { useSearchParams } from "next/navigation";
import { EditDegreeTitleDialog } from "./components/edit-degree-title-dialog";
import { DeleteDegreeTitleDialog } from "./components/delete-degree-title-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
  const searchParams = useSearchParams();
  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");
  const role = useSelector((state: RootState) => state.user.role);

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");
  // Handle error state
  if (isError) {
    console.error("Error loading degree titles:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("nav.degreeTitle")}</h1>
          <p className="text-sm text-gray-500">
            {t("common.total")}: {listData?.meta.total}{" "}
          </p>
        </div>
        {role === "PDT" && <CreateDegreeTitleDialog />}
      </div>
      <DataTable
        columns={columns}
        data={Array.isArray(listData) ? listData : listData?.items || []}
        onPaginationChange={setPagination}
        listMeta={Array.isArray(listData) ? undefined : listData?.meta}
        containerClassName="flex-1"
        isLoading={isLoadingListData && !isError}
      />
      {openEditDialog && searchParams.get("id") && (
        <EditDegreeTitleDialog
          open={openEditDialog}
          id={searchParams.get("id")!}
          name={searchParams.get("name") ?? ""}
        />
      )}

      {openDeleteDialog &&
        searchParams.get("id") &&
        searchParams.get("name") && (
          <DeleteDegreeTitleDialog
            open={openDeleteDialog}
            id={searchParams.get("id")!}
            name={decodeURIComponent(searchParams.get("name")!)}
          />
        )}
    </div>
  );
}
