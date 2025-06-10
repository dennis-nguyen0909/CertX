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
import { useClassList } from "@/hooks/class/use-class-list";
import { EditDialog } from "./components/edit-dialog";
import { CreateDialog } from "./components/create-dialog";
import { DeleteDialog } from "./components/delete-dialog";

export default function ClassListPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  // const [sort, setSort] = useState<string>("className");
  const { setPagination, ...pagination } = usePaginationQuery();
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const {
    data: listData,
    isLoading: isLoadingListData,
    error,
    isError,
  } = useClassList({
    ...pagination,
    className: debouncedSearch,
  });

  console.log("listData 123", listData);

  const columns = useColumns(t);

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  // Construct class data from URL parameters for edit dialog
  const getClassDataFromParams = () => {
    const id = searchParams.get("id");
    const className = searchParams.get("className");

    if (id && className) {
      return {
        id: parseInt(id),
        className: decodeURIComponent(className),
      };
    }
    return undefined;
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Handle error state
  if (isError) {
    console.error("Error loading classes:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-bold">{t("class.management")}</h1>
        <CreateDialog />
      </div>
      <div className="flex flex-row gap-4">
        <div className="relative w-1/4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("common.searching")}
            className="pl-8"
          />
        </div>
        <Select onValueChange={() => {}}>
          <SelectTrigger>
            <SelectValue placeholder={t("common.sort")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="className">{t("class.className")}</SelectItem>
            <SelectItem value="created_at">{t("common.createdAt")}</SelectItem>
          </SelectContent>
        </Select>
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
        <EditDialog
          open={openEditDialog}
          id={searchParams.get("id")!}
          classData={getClassDataFromParams()}
        />
      )}

      {openDeleteDialog &&
        searchParams.get("id") &&
        searchParams.get("className") && (
          <DeleteDialog
            open={openDeleteDialog}
            id={searchParams.get("id")!}
            className={decodeURIComponent(searchParams.get("className")!)}
          />
        )}
    </div>
  );
}
