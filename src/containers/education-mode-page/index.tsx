"use client";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { useEducationModeList } from "@/hooks/education-mode/use-education-mode-list";
import { useGuardRoute } from "@/hooks/use-guard-route";
import { CreateEducationModeDialog } from "./components/create-education-mode-dialog";
import { useSearchParams } from "next/navigation";
import { EditEducationModeDialog } from "./components/edit-education-mode-dialog";
import { DeleteEducationModeDialog } from "./components/delete-education-mode-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function EducationModePage() {
  const { t } = useTranslation();
  const { pageIndex, pageSize, setPagination } = usePaginationQuery();

  useGuardRoute();

  const {
    data: listData,
    isLoading: isLoadingListData,
    error,
    isError,
  } = useEducationModeList({
    size: pageSize,
    page: pageIndex + 1,
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
    console.error("Error loading education modes:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("nav.educationMode")}</h1>
          <p className="text-sm text-gray-500">
            {t("common.total")}: {listData?.meta.total}{" "}
          </p>
        </div>
        {role === "PDT" && <CreateEducationModeDialog />}
      </div>
      <DataTable
        columns={columns}
        data={listData?.items || []}
        onPaginationChange={setPagination}
        listMeta={listData?.meta}
        containerClassName="flex-1"
        isLoading={isLoadingListData && !isError}
      />
      {openEditDialog && searchParams.get("id") && (
        <EditEducationModeDialog
          open={openEditDialog}
          id={searchParams.get("id")!}
          name={searchParams.get("name") ?? ""}
        />
      )}

      {openDeleteDialog &&
        searchParams.get("id") &&
        searchParams.get("name") && (
          <DeleteEducationModeDialog
            open={openDeleteDialog}
            id={searchParams.get("id")!}
            name={decodeURIComponent(searchParams.get("name")!)}
          />
        )}
    </div>
  );
}
