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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, List } from "lucide-react";
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
import { ConfirmDialog } from "./components/confirm-dialog";
import { useCertificatesList } from "@/hooks/certificates/use-certificates-list";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Certificate } from "@/models/certificate";
import { PageInfo } from "@/models/common";

export default function CertificatesPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("nameStudent");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const [currentView, setCurrentView] = useState<"main" | "pending">("main");
  const role = useSelector((state: RootState) => state.user.role);

  // Build search params based on selected field
  const buildSearchParams = () => {
    if (!debouncedSearch) return {};

    switch (searchField) {
      case "nameStudent":
        return { studentName: debouncedSearch };
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

  const searchParamsForApi = {
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    ...buildSearchParams(),
  };

  // Use unified hook with role and view parameters
  const certificatesQuery = useCertificatesList({
    role: role || "KHOA",
    view: currentView,
    page: searchParamsForApi.page,
    size: searchParamsForApi.size,
    ...buildSearchParams(),
  });

  // Use the unified query result directly
  const {
    data: rawData,
    isLoading: currentIsLoading,
    error: currentError,
    isError: currentIsError,
  } = certificatesQuery;

  // Helper functions to extract data from different response structures
  const getItems = () => {
    if (!rawData) return [];
    if (role === "KHOA" && "data" in rawData) {
      return (rawData as { data: { items: Certificate[] } }).data.items;
    }
    if ("items" in rawData) {
      return (rawData as { items: Certificate[] }).items;
    }
    return [];
  };

  const getMeta = () => {
    if (!rawData) return undefined;
    if (role === "KHOA" && "data" in rawData) {
      return (rawData as { data: { meta: PageInfo } }).data.meta;
    }
    if ("meta" in rawData) {
      return (rawData as { meta: PageInfo }).meta;
    }
    return undefined;
  };

  const columns = useColumns(t);

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  const openViewDialog =
    searchParams.get("action") === "view" && searchParams.has("id");

  const openConfirmDialog =
    searchParams.get("action") === "confirm" && searchParams.has("id");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Handle error state
  if (currentIsError) {
    console.error("Error loading certificates:", currentError);
  }

  // Show pending certificates only for PDT role
  const showPendingView = role === "PDT";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{t("certificates.management")}</h1>
          <Badge
            variant={currentView === "pending" ? "secondary" : "default"}
            className="text-xs"
          >
            {currentView === "main"
              ? t("certificates.allCertificates")
              : t("certificates.pendingCertificates")}
          </Badge>
        </div>
        {role !== "PDT" && role !== "ADMIN" && (
          <div className="flex gap-2">
            <ExcelUploadDialog />
            <CreateDialog />
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4 items-center">
        {/* Toggle Buttons - Only show for PDT role */}
        {showPendingView && (
          <div className="flex bg-muted p-1 rounded-lg">
            <Button
              variant={currentView === "main" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("main")}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              {t("certificates.allCertificates")}
            </Button>
            <Button
              variant={currentView === "pending" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("pending")}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              {t("certificates.pendingCertificates")}
              {currentView === "pending" &&
                rawData &&
                getMeta()?.total !== undefined && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {getMeta()?.total}
                  </Badge>
                )}
            </Button>
          </div>
        )}

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
        data={getItems()}
        onPaginationChange={setPagination}
        listMeta={getMeta()}
        containerClassName="flex-1"
        isLoading={currentIsLoading && !currentIsError}
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

      {openConfirmDialog && searchParams.get("id") && (
        <ConfirmDialog open={openConfirmDialog} id={searchParams.get("id")!} />
      )}
    </div>
  );
}
