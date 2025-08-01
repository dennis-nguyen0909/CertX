"use client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { EditDialog } from "@/containers/student-list-page/components/edit-dialog";
import { CreateDialog } from "@/containers/student-list-page/components/create-dialog";
import { DeleteDialog } from "@/containers/student-list-page/components/delete-dialog";
import { ImportDialog } from "@/containers/student-list-page/components/import-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useUrlSyncState } from "@/hooks/use-url-sync-state";
import { useRouter, useSearchParams } from "next/navigation";
import { ViewDialog } from "@/containers/student-list-page/components/view-dialog";
import { useGuardRoute } from "@/hooks/use-guard-route";
import RewardDialog from "./components/reward-dialog";
import { useStudentListCoinKhoa } from "@/hooks/student/use-student-coin-khoa";

export default function PrizesStudentCoinPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const [search, setSearch] = useUrlSyncState("search");
  const [className, setClassName] = useUrlSyncState("className");
  const [departmentName, setDepartmentName] = useUrlSyncState("departmentName");
  const [studentCode, setStudentCode] = useUrlSyncState("studentCode");
  const searchParams = useSearchParams();
  const role = useSelector((state: RootState) => state.user.role);
  const router = useRouter();
  const {
    data: listData,
    isLoading: isLoadingListData,
    isError,
  } = useStudentListCoinKhoa({
    ...pagination,
    name: search || undefined,
    className: className || undefined,
    studentCode: studentCode || undefined,
    departmentName: departmentName || undefined,
  });
  useGuardRoute();

  const columns = useColumns(t);

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  const openRewardDialog =
    searchParams.get("action") === "reward" && searchParams.has("id");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-2xl font-bold">{t("student.list")}</h1>
          <p className="text-sm text-gray-500">
            {t("common.total")}: {listData?.meta.total}{" "}
          </p>
        </div>
        {role === "PDT" && (
          <div className="flex gap-2">
            <ImportDialog />
            <CreateDialog />
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4 flex-wrap sm:flex-nowrap">
        <div className="relative w-full sm:w-1/3">
          <span className="absolute left-2 top-2.5 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </span>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("student.searchByName")}
            className="pl-8"
          />
        </div>

        <div className="relative w-full sm:w-1/3">
          <span className="absolute left-2 top-2.5 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </span>
          <Input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder={t("student.searchByClass")}
            className="pl-8"
          />
        </div>

        <div className="relative w-full sm:w-1/3">
          <span className="absolute left-2 top-2.5 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </span>
          <Input
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            placeholder={t("student.searchByCode")}
            className="pl-8"
          />
        </div>

        {role !== "KHOA" && (
          <div className="relative w-full sm:w-1/3">
            <span className="absolute left-2 top-2.5 flex items-center">
              <Search className="h-4 w-4 text-muted-foreground" />
            </span>
            <Input
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder={t("student.searchByDepartment")}
              className="pl-8"
            />
          </div>
        )}
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
        <EditDialog open={openEditDialog} id={searchParams.get("id")!} />
      )}

      {searchParams.get("action") === "view" && searchParams.get("id") && (
        <ViewDialog open={true} id={searchParams.get("id")!} />
      )}

      {openDeleteDialog &&
        searchParams.get("id") &&
        searchParams.get("name") && (
          <DeleteDialog
            open={openDeleteDialog}
            id={searchParams.get("id")!}
            name={decodeURIComponent(searchParams.get("name")!)}
          />
        )}

      {openRewardDialog && (
        <RewardDialog
          onClose={() => router.back()}
          open={openRewardDialog}
          currentCoin={searchParams.get("currentCoin") ?? ""}
          studentId={searchParams.get("id") ?? ""}
          studentName={searchParams.get("studentName") ?? ""}
        />
      )}
    </div>
  );
}
