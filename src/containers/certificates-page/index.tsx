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
import { ConfirmCertificateDialogIds } from "./components/confirm-certificate-dialog-ids";
import { useCertificatesList } from "@/hooks/certificates/use-certificates-list";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCertificatesConfirmList } from "@/hooks/certificates/use-certificates-confirm-list";
import { Certificate } from "@/models/certificate";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "./components/confirm-dialog";

export default function CertificatesPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("studentName");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const [currentView, setCurrentView] = useState<"main" | "pending">("main");
  const role = useSelector((state: RootState) => state.user.role);
  const [selectedRows, setSelectedRows] = useState<Certificate[]>([]);
  const confirmMutation = useCertificatesConfirmList();
  const [openConfirmDialogIds, setOpenConfirmDialogIds] = useState(false);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const [tableResetKey, setTableResetKey] = useState(0);

  // Build search params based on selected field
  const buildSearchParams = () => {
    if (!debouncedSearch) return {};

    switch (searchField) {
      case "studentName":
        return { studentName: debouncedSearch };
      case "studentCode":
        return { studentCode: debouncedSearch };
      case "className":
        return { className: debouncedSearch };
      case "departmentName":
        return { departmentName: debouncedSearch };
      default:
        return { studentName: debouncedSearch };
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
    isError: currentIsError,
  } = certificatesQuery;

  console.log("duydeptrai rawData", rawData);

  const columns = useColumns(t, currentView);

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

  // Show pending certificates only for PDT role
  const showPendingView = role === "PDT";

  const handleOpenConfirmDialog = () => {
    setPendingIds(selectedRows.map((row) => Number(row.id)));
    setOpenConfirmDialogIds(true);
  };

  const handleConfirmCertificates = () => {
    confirmMutation.mutate(pendingIds, {
      onSuccess: () => {
        setOpenConfirmDialogIds(false);
        setPendingIds([]);
        setSelectedRows([]);
        setTableResetKey((k) => k + 1);
        queryClient.invalidateQueries({ queryKey: ["certificates-list"] });
        queryClient.invalidateQueries({
          queryKey: ["certificates-pending-list"],
        });
        // reload hoặc thông báo thành công
      },
      onError: () => {
        // thông báo lỗi
      },
    });
  };

  // Reset selectedRows khi chuyển currentView
  useEffect(() => {
    setSelectedRows([]);
    setPendingIds([]);
  }, [currentView]);

  console.log("duydeptrai selectedRows", selectedRows);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{t("certificates.management")}</h1>
          <p className="text-sm text-gray-500">
            {t("certificates.total")}: {rawData?.meta?.total || 0}
          </p>
        </div>
        {role !== "PDT" && role !== "ADMIN" && (
          <div className="flex gap-2">
            <ExcelUploadDialog />
            <CreateDialog />
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4 items-center justify-between">
        {/* Toggle Buttons - Only show for PDT role */}
        <div className="flex flex-row gap-4 items-center">
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
                  rawData.meta?.total !== undefined && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {rawData.meta.total}
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
              <SelectItem value="studentName">
                {t("certificates.nameStudent")}
              </SelectItem>
              <SelectItem value="studentCode">
                {t("certificates.studentCode")}
              </SelectItem>
              <SelectItem value="className">
                {t("certificates.className")}
              </SelectItem>
              {role === "PDT" && (
                <SelectItem value="departmentName">
                  {t("certificates.department")}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        {currentView === "pending" && selectedRows.length > 0 ? (
          <Button
            onClick={handleOpenConfirmDialog}
            variant="default"
            disabled={confirmMutation.status === "pending"}
          >
            Xác nhận chứng chỉ ({selectedRows.length})
          </Button>
        ) : null}
      </div>

      <DataTable
        key={currentView + "-" + tableResetKey}
        columns={columns}
        data={rawData?.items || []}
        onPaginationChange={setPagination}
        listMeta={rawData?.meta}
        containerClassName="flex-1"
        isLoading={currentIsLoading && !currentIsError}
        onSelectedRowsChange={setSelectedRows}
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

      <ConfirmCertificateDialogIds
        open={openConfirmDialogIds}
        onClose={() => setOpenConfirmDialogIds(false)}
        onConfirm={handleConfirmCertificates}
        ids={pendingIds}
        loading={confirmMutation.status === "pending"}
      />
    </div>
  );
}
