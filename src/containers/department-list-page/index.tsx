"use client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EditDialog } from "./components/edit-dialog";
import { CreateDialog } from "./components/create-dialog";
import { ChangePasswordDialog } from "./components/change-password-dialog";
import { LockDialog } from "./components/lock-dialog";
import { useUserDepartmentList } from "@/hooks/user/use-user-department-list";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ImportDialog } from "./components/import-dialog";
import { useGuardRoute } from "@/hooks/use-guard-route";
import { DeleteDialog } from "./components/delete-dialog";

export default function DepartmentListPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const role = useSelector((state: RootState) => state.user.role);
  // const [sort, setSort] = useState<string>("name");
  const {
    data: listData,
    refetch,
    isError,
    isLoading: isLoadingListData,
  } = useUserDepartmentList({
    ...pagination,
    name: search.trim(),
    // sort: [sort],
  });
  const editDepartmentName = searchParams.get("name");
  const { columns } = useColumns(t, refetch);
  useGuardRoute();

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openChangePasswordDialog =
    searchParams.get("action") === "change-password" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  const openLockDialog =
    searchParams.get("action") === "lock" && searchParams.has("id");

  // const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      // setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-2xl font-bold">{t("department.management")}</h1>
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
      <div className="flex flex-row gap-4">
        <div className="relative w-full  sm:w-1/4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("department.searchName")}
            className="pl-8"
          />
        </div>
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

      {openChangePasswordDialog && searchParams.get("id") && (
        <ChangePasswordDialog
          isOpen={openChangePasswordDialog}
          onOpenChange={() => router.push("/department-list")}
          departmentId={parseInt(searchParams.get("id")!)}
          departmentName={decodeURIComponent(searchParams.get("name") || "")}
        />
      )}

      {/* {openDeleteDialog && searchParams.get("id") && (
        <NotificationDelete
          isOpen={openDeleteDialog}
          onOpenChange={() => router.push("/department-list")}
          onConfirm={() => handleConfirmDelete(searchParams.get("id")!)}
          onCancel={handleCancelDelete}
          itemName={decodeURIComponent(
            searchParams.get("name") || t("common.unknown")
          )}
        />
      )} */}

      {openLockDialog && searchParams.get("id") && (
        <LockDialog
          id={searchParams.get("id")!}
          name={decodeURIComponent(searchParams.get("name") || "")}
          isLocked={searchParams.get("locked") === "true"}
          open={openLockDialog}
          onClose={() => router.push("/department-list")}
          onSuccess={() => refetch()}
        />
      )}
      {openDeleteDialog && searchParams.get("id") && editDepartmentName && (
        <DeleteDialog
          open={openDeleteDialog}
          id={searchParams.get("id") || ""}
          className={decodeURIComponent(editDepartmentName)}
        />
      )}
    </div>
  );
}
