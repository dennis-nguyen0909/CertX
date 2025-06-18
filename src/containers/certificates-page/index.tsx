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
import { ConfirmCertificateDialogIds } from "./components/confirm-certificate-dialog-ids";
import { useCertificatesList } from "@/hooks/certificates/use-certificates-list";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCertificatesConfirmList } from "@/hooks/certificates/use-certificates-confirm-list";
import { Certificate } from "@/models/certificate";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function CertificatesPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("studentName");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const role = useSelector((state: RootState) => state.user.role);
  const [selectedRows, setSelectedRows] = useState<Certificate[]>([]);
  const [selectedPendingRows, setSelectedPendingRows] = useState<Certificate[]>(
    []
  );
  const [pendingSearch, setPendingSearch] = useState<string>("");
  const [pendingSearchField, setPendingSearchField] =
    useState<string>("studentName");
  const [debouncedPendingSearch, setDebouncedPendingSearch] =
    useState<string>("");
  const confirmMutation = useCertificatesConfirmList();
  const [openConfirmDialogIds, setOpenConfirmDialogIds] = useState(false);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const [tableResetKey, setTableResetKey] = useState(0);
  const [currentTab, setCurrentTab] = useState("all");

  // Reset pagination when tab changes
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  };

  // Build search params for main tab
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

  // Build search params for pending tab
  const buildPendingSearchParams = () => {
    if (!debouncedPendingSearch) return {};
    switch (pendingSearchField) {
      case "studentName":
        return { studentName: debouncedPendingSearch };
      case "studentCode":
        return { studentCode: debouncedPendingSearch };
      case "className":
        return { className: debouncedPendingSearch };
      case "departmentName":
        return { departmentName: debouncedPendingSearch };
      default:
        return { studentName: debouncedPendingSearch };
    }
  };

  // Main certificates query
  const certificatesQuery = useCertificatesList({
    role: role || "KHOA",
    view: "main",
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    ...buildSearchParams(),
  });

  // Pending certificates query (for PDT)
  const pendingCertificatesQuery = useCertificatesList({
    role: role || "KHOA",
    view: "pending",
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    ...buildPendingSearchParams(),
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPendingSearch(pendingSearch);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [pendingSearch]);

  const handleOpenConfirmDialog = () => {
    const selectedCertificates =
      currentTab === "all" ? selectedRows : selectedPendingRows;
    setPendingIds(selectedCertificates.map((row) => Number(row.id)));
    setOpenConfirmDialogIds(true);
  };

  const handleConfirmCertificates = () => {
    confirmMutation.mutate(pendingIds, {
      onSuccess: () => {
        setOpenConfirmDialogIds(false);
        setPendingIds([]);
        setSelectedRows([]);
        setSelectedPendingRows([]);
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
    setSelectedPendingRows([]);
    setPendingIds([]);
  }, []);

  console.log("duydeptrai selectedRows", selectedRows);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{t("certificates.management")}</h1>
          <p className="text-sm text-gray-500">
            {t("certificates.total")}:{" "}
            {currentTab === "all"
              ? certificatesQuery.data?.meta?.total || 0
              : pendingCertificatesQuery.data?.meta?.total || 0}
          </p>
        </div>
        {role !== "PDT" && role !== "ADMIN" && (
          <div className="flex gap-2">
            <ExcelUploadDialog />
            <CreateDialog />
          </div>
        )}
      </div>
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="all">
            {t("certificates.allCertificates")}
          </TabsTrigger>
          {role === "PDT" && (
            <TabsTrigger value="pending">
              {t("certificates.pendingCertificates")}
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="flex flex-row gap-4 items-center mb-4">
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
            {selectedRows.length > 0 && (
              <Button
                onClick={handleOpenConfirmDialog}
                variant="default"
                disabled={confirmMutation.status === "pending"}
              >
                {t("certificates.confirmAction")} ({selectedRows.length})
              </Button>
            )}
          </div>
          <DataTable
            key={"all-" + tableResetKey}
            columns={columns}
            data={certificatesQuery.data?.items || []}
            onPaginationChange={setPagination}
            listMeta={certificatesQuery.data?.meta}
            containerClassName="flex-1"
            isLoading={
              certificatesQuery.isLoading && !certificatesQuery.isError
            }
            onSelectedRowsChange={setSelectedRows}
          />
        </TabsContent>
        {role === "PDT" && (
          <TabsContent value="pending" className="mt-4">
            <div className="flex flex-row gap-4 items-center mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={pendingSearch}
                  onChange={(e) => setPendingSearch(e.target.value)}
                  placeholder={t("certificates.searchPlaceholder")}
                  className="pl-8"
                />
              </div>
              <Select
                value={pendingSearchField}
                onValueChange={setPendingSearchField}
              >
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
                  <SelectItem value="departmentName">
                    {t("certificates.department")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {selectedPendingRows.length > 0 && (
                <Button
                  onClick={handleOpenConfirmDialog}
                  variant="default"
                  disabled={confirmMutation.status === "pending"}
                >
                  {t("certificates.confirmAction")} (
                  {selectedPendingRows.length})
                </Button>
              )}
            </div>
            <DataTable
              key={"pending-" + tableResetKey}
              columns={columns}
              data={pendingCertificatesQuery.data?.items || []}
              onPaginationChange={setPagination}
              listMeta={pendingCertificatesQuery.data?.meta}
              containerClassName="flex-1"
              isLoading={
                pendingCertificatesQuery.isLoading &&
                !pendingCertificatesQuery.isError
              }
              onSelectedRowsChange={setSelectedPendingRows}
            />
          </TabsContent>
        )}
      </Tabs>
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
