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
import { EditDialog } from "./components/edit-dialog";
import { CreateDialog } from "./components/create-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { ViewDialog } from "./components/view-dialog";
import { ExcelUploadDialog } from "./components/excel-upload-dialog";
import { useCertificatesPdtList } from "@/hooks/certificates/use-certificates-pdt-list";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function CertificatesPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("nameStudent");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const role = useSelector((state: RootState) => state.user.role);
  console.log("role 123", role);
  // Build search params based on selected field
  const buildSearchParams = () => {
    if (!debouncedSearch) return {};

    switch (searchField) {
      case "nameStudent":
        return { nameStudent: debouncedSearch };
      case "certificateName":
        return { certificateName: debouncedSearch };
      case "className":
        return { className: debouncedSearch };
      case "department":
        return { department: debouncedSearch };
      case "status":
        return { status: debouncedSearch };
      default:
        return { nameStudent: debouncedSearch };
    }
  };

  const {
    data: listData,
    isLoading: isLoadingListData,
    error,
    isError,
  } = useCertificatesPdtList({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    ...buildSearchParams(),
  });

  const columns = useColumns(t);

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  const openViewDialog =
    searchParams.get("action") === "view" && searchParams.has("id");

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
    console.error("Error loading certificates:", error);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("certificates.management")}</h1>
        {role !== "PDT" && role !== "ADMIN" && (
          <div className="flex gap-2">
            <ExcelUploadDialog />
            <CreateDialog />
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("certificates.searchPlaceholder")}
            className="pl-8"
          />
        </div>

        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={t("certificates.searchBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nameStudent">
              {t("certificates.nameStudent")}
            </SelectItem>
            <SelectItem value="certificateName">
              {t("certificates.certificateName")}
            </SelectItem>
            <SelectItem value="className">
              {t("certificates.className")}
            </SelectItem>
            <SelectItem value="department">
              {t("certificates.department")}
            </SelectItem>
            <SelectItem value="status">{t("certificates.status")}</SelectItem>
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

      {openViewDialog && searchParams.get("id") && (
        <ViewDialog
          open={openViewDialog}
          id={parseInt(searchParams.get("id")!)}
        />
      )}
    </div>
  );
}
