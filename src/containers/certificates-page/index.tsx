"use client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { ConfirmDialog } from "./components/confirm-dialog";
import { Label } from "@/components/ui/label";

export default function CertificatesPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const searchParams = useSearchParams();
  const role = useSelector((state: RootState) => state.user.role);
  const [selectedRows, setSelectedRows] = useState<Certificate[]>([]);
  const [selectedPendingRows, setSelectedPendingRows] = useState<Certificate[]>(
    []
  );
  const confirmMutation = useCertificatesConfirmList();
  const [openConfirmDialogIds, setOpenConfirmDialogIds] = useState(false);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const [tableResetKey, setTableResetKey] = useState(0);
  const [currentTab, setCurrentTab] = useState("all");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmingCertificate, setConfirmingCertificate] =
    useState<Certificate | null>(null);
  const [filterValues, setFilterValues] = useState({
    studentName: "",
    studentCode: "",
    className: "",
    departmentName: "",
  });
  const [debouncedFilterValues, setDebouncedFilterValues] =
    useState(filterValues);

  // Debounce filter values
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterValues(filterValues);
    }, 500);
    return () => clearTimeout(handler);
  }, [filterValues]);

  // Filter handlers
  const handleFilterChange =
    (field: keyof typeof filterValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  // Reset pagination when tab changes
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  };

  // Main certificates query
  const certificatesQuery = useCertificatesList({
    role: role || "KHOA",
    view: "main",
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    ...debouncedFilterValues,
  });

  // Pending certificates query (for PDT)
  const pendingCertificatesQuery = useCertificatesList({
    role: role || "KHOA",
    view: "pending",
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    ...debouncedFilterValues,
  });

  const columns = useColumns({
    t,
    onConfirm: (certificate: Certificate) => {
      setConfirmingCertificate(certificate);
      setConfirmDialogOpen(true);
    },
  });

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  const openViewDialog =
    searchParams.get("action") === "view" && searchParams.has("id");

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

  // Reset selectedRows when switching tabs
  useEffect(() => {
    setSelectedRows([]);
    setSelectedPendingRows([]);
    setPendingIds([]);
  }, [currentTab]);

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

      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1 items-end">
          <div className="flex flex-col">
            <Label className="mb-2">{t("certificates.nameStudent")}</Label>
            <Input
              value={filterValues.studentName}
              onChange={handleFilterChange("studentName")}
              placeholder={t("certificates.studentNamePlaceholder")}
              className="min-w-[140px]"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">{t("certificates.studentCode")}</Label>
            <Input
              value={filterValues.studentCode}
              onChange={handleFilterChange("studentCode")}
              placeholder={t("certificates.studentCodePlaceholder")}
              className="min-w-[120px]"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">{t("certificates.className")}</Label>
            <Input
              value={filterValues.className}
              onChange={handleFilterChange("className")}
              placeholder={t("certificates.classNamePlaceholder")}
              className="min-w-[120px]"
            />
          </div>
          {role === "PDT" && (
            <div className="flex flex-col">
              <Label className="mb-2">{t("certificates.department")}</Label>
              <Input
                value={filterValues.departmentName}
                onChange={handleFilterChange("departmentName")}
                placeholder={t("certificates.departmentPlaceholder")}
                className="min-w-[140px]"
              />
            </div>
          )}
        </div>
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
          {selectedRows.length > 0 && role === "PDT" && (
            <Button
              onClick={handleOpenConfirmDialog}
              variant="default"
              disabled={confirmMutation.isPending}
              className="mb-4"
            >
              {t("common.confirm")} ({selectedRows.length})
            </Button>
          )}
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
            {selectedPendingRows.length > 0 && (
              <Button
                onClick={handleOpenConfirmDialog}
                variant="default"
                disabled={confirmMutation.isPending}
                className="mb-4"
              >
                {t("common.confirm")} ({selectedPendingRows.length})
              </Button>
            )}
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
        loading={confirmMutation.isPending}
      />
      {confirmingCertificate && (
        <ConfirmDialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          certificate={confirmingCertificate}
        />
      )}
    </div>
  );
}
