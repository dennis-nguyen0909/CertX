"use client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCertificatesTypeList } from "@/hooks/certificates-type/use-certificates-type-list";
import { EditDialog } from "./components/edit-dialog";
import { CreateDialog } from "./components/create-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGuardRoute } from "@/hooks/use-guard-route";

export default function CertificatesPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  // const [sort, setSort] = useState<string>("name");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const role = useSelector((state: RootState) => state.user.role);
  const {
    data: listData,
    isLoading: isLoadingListData,
    error,
    isError,
  } = useCertificatesTypeList({
    role: role?.toLowerCase() || "pdt",
    ...pagination,
    name: debouncedSearch,
    // sort: [sort],
  });
  const columns = useColumns(t);
  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  const openCreateDialog = searchParams.get("action") === "create";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useGuardRoute();

  // Handle error state
  if (isError) {
    console.error("Error loading certificates:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">
          {t("certificatesType.management")}
        </h1>
        {role === "PDT" && <CreateDialog open={openCreateDialog} />}
      </div>
      <div className="flex flex-row gap-4">
        <div className="relative sm:w-1/4 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("certificatesType.searching")}
            className="pl-8"
          />
        </div>
        {/* <Select onValueChange={() => {}}>
          <SelectTrigger>
            <SelectValue placeholder={t("common.sort")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t("common.name")}</SelectItem>
            <SelectItem value="created_at">{t("common.createdAt")}</SelectItem>
          </SelectContent>
        </Select> */}
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
        <EditDialog open={openEditDialog} id={searchParams.get("id")!} />
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
