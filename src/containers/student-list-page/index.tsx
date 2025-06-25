"use client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { useStudentList } from "@/hooks/student/use-student-list";
import { EditDialog } from "./components/edit-dialog";
import { CreateDialog } from "./components/create-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { ImportDialog } from "./components/import-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useUrlSyncState } from "@/hooks/use-url-sync-state";
import { useSearchParams } from "next/navigation";
import { ViewDialog } from "./components/view-dialog";

export default function StudentListPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const [search, setSearch] = useUrlSyncState("search");
  const [className, setClassName] = useUrlSyncState("className");
  const [departmentName, setDepartmentName] = useUrlSyncState("departmentName");
  const searchParams = useSearchParams();
  const role = useSelector((state: RootState) => state.user.role);
  const {
    data: listData,
    isLoading: isLoadingListData,
    isError,
  } = useStudentList({
    ...pagination,
    name: search || undefined,
    className: className || undefined,
    departmentName: departmentName || undefined,
  });

  const columns = useColumns(t);

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">{t("student.management")}</h1>
        {role === "PDT" && (
          <div className="flex gap-2">
            <ImportDialog />
            <CreateDialog />
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4">
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("student.searchByName")}
            className="pl-8"
          />
        </div>

        <Input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder={t("student.searchByClass")}
          className="w-1/3"
        />

        <Input
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder={t("student.searchByDepartment")}
          className="w-1/3"
        />
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
    </div>
  );
}
