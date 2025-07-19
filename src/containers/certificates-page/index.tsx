"use client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EditDialog } from "./components/edit-dialog";
import { CreateDialog } from "./components/create-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { ViewDialog } from "./components/view-dialog";
import { ExcelUploadDialog } from "./components/excel-upload-dialog";
import { ExportDialog } from "./components/export-dialog";
import { ConfirmCertificateDialogIds } from "./components/confirm-certificate-dialog-ids";
import { useCertificatesList } from "@/hooks/certificates/use-certificates-list";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCertificatesConfirmList } from "@/hooks/certificates/use-certificates-confirm-list";
import { useCertificatesRejectList } from "@/hooks/certificates/use-certificates-reject-list";
import { Certificate, CertificateSearchParams } from "@/models/certificate";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ConfirmDialog } from "./components/confirm-dialog";
import { Label } from "@/components/ui/label";
import { RejectDialog } from "./components/reject-dialog";
import { useGuardRoute } from "@/hooks/use-guard-route";
import { Loader2 } from "lucide-react";
import { CertificatesService } from "@/services/certificates/certificates.service";
import { RejectCertificateDialogIds } from "./components/reject-certificate-dialog-ids";
import { DeleteCertificateListDialog } from "./components/delete-list-dialog";
import { isAxiosError } from "axios";

export default function CertificatesPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = useSelector((state: RootState) => state.user.role);
  const [selectedRows, setSelectedRows] = useState<Certificate[]>([]);
  const [selectedPendingRows, setSelectedPendingRows] = useState<Certificate[]>(
    []
  );
  const confirmMutation = useCertificatesConfirmList();
  const [openConfirmDialogIds, setOpenConfirmDialogIds] = useState(false);
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const [tableResetKey, setTableResetKey] = useState(0);
  const [currentTab, setCurrentTab] = useState("all");
  const [filterValues, setFilterValues] = useState({
    studentName: "",
    studentCode: "",
    className: "",
    departmentName: "",
    diplomaNumber: "",
  });
  const [debouncedFilterValues, setDebouncedFilterValues] =
    useState(filterValues);
  const invalidateCertificates = useInvalidateByKey("certificate");
  const [isSelectingAll, setIsSelectingAll] = useState(false);
  const [openRejectDialogIds, setOpenRejectDialogIds] = useState(false);
  const [openDeleteDialogIds, setOpenDeleteDialogIds] = useState(false);
  const [rejectIds, setRejectIds] = useState<number[]>([]);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const rejectMutation = useCertificatesRejectList();
  useGuardRoute();

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

  // Set initial tab from URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      ["all", "pending", "rejected", "approved"].includes(tabParam)
    ) {
      setCurrentTab(tabParam);
    }
  }, [searchParams]);

  // Reset pagination when tab changes and update URL
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
    // Update tab param in URL
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("tab", value);
    router.replace("?" + params.toString());
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

  const rejectedCertificatesQuery = useCertificatesList({
    role: role || "KHOA",
    view: "rejected",
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    ...debouncedFilterValues,
  });

  const approvedCertificatesQuery = useCertificatesList({
    role: role || "KHOA",
    view: "approved",
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    ...debouncedFilterValues,
  });

  const columns = useColumns({
    t,
    currentTab,
    searchParams,
  });

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  const openViewDialog =
    searchParams.get("action") === "view" && searchParams.has("id");

  const openRejectDialog =
    searchParams.get("action") === "reject" && searchParams.has("id");

  const openConfirmDialog =
    searchParams.get("action") === "confirm" && searchParams.has("id");

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
        invalidateCertificates();
        // reload hoặc thông báo thành công
      },
      onError: () => {
        // thông báo lỗi
      },
    });
  };

  const handleOpenRejectDialogIds = () => {
    const selectedCertificates =
      currentTab === "all" ? selectedRows : selectedPendingRows;
    setRejectIds(selectedCertificates.map((row) => Number(row.id)));
    setOpenRejectDialogIds(true);
  };
  const handleOpenDeleteDialogIds = () => {
    const selectedCertificates =
      currentTab === "all" ? selectedRows : selectedPendingRows;
    setDeleteIds(selectedCertificates.map((row) => Number(row.id)));
    setOpenDeleteDialogIds(true);
  };

  const handleRejectCertificates = () => {
    rejectMutation.mutate(rejectIds, {
      onSuccess: () => {
        setOpenRejectDialogIds(false);
        setOpenDeleteDialogIds(false);
        setRejectIds([]);
        setDeleteIds([]);
        setSelectedRows([]);
        setSelectedPendingRows([]);
        setTableResetKey((k) => k + 1);
        invalidateCertificates();
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

  // Hàm lấy toàn bộ certificates cho tab hiện tại
  const fetchAllCertificates = async () => {
    setIsSelectingAll(true);
    let allItems: Certificate[] = [];
    const size = 100;
    let total = 0;
    const params: CertificateSearchParams = {
      page: 1,
      size,
      ...debouncedFilterValues,
    };

    let firstPage;
    let totalPages = 1;
    if (currentTab === "pending") {
      firstPage = await CertificatesService.listCertificatesPending(
        params,
        role || "KHOA"
      );
    } else if (currentTab === "rejected") {
      firstPage = await CertificatesService.listCertificatesRejected(
        params,
        role || "KHOA"
      );
    } else if (currentTab === "approved") {
      firstPage = await CertificatesService.listCertificatesApproved(
        params,
        role || "KHOA"
      );
    } else {
      firstPage = await CertificatesService.listCertificates(
        role || "KHOA",
        params
      );
    }
    total = firstPage.meta?.total || 0;
    allItems = firstPage.items || [];
    totalPages = Math.ceil(total / size);

    if (totalPages > 1) {
      const promises = [];
      for (let p = 2; p <= totalPages; p++) {
        const pageParams = { ...params, page: p };
        if (currentTab === "pending") {
          promises.push(
            CertificatesService.listCertificatesPending(
              pageParams,
              role || "KHOA"
            )
          );
        } else if (currentTab === "rejected") {
          promises.push(
            CertificatesService.listCertificatesRejected(
              pageParams,
              role || "KHOA"
            )
          );
        } else if (currentTab === "approved") {
          promises.push(
            CertificatesService.listCertificatesApproved(
              pageParams,
              role || "KHOA"
            )
          );
        } else {
          promises.push(
            CertificatesService.listCertificates(role || "KHOA", pageParams)
          );
        }
      }
      const results = await Promise.all(promises);
      results.forEach((res) => {
        if (res.items) allItems = allItems.concat(res.items);
      });
    }

    if (currentTab === "pending") {
      setSelectedPendingRows(allItems);
    } else {
      setSelectedRows(allItems);
    }
    setIsSelectingAll(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{t("certificates.management")}</h1>
          <p className="text-sm text-gray-500">
            {t("certificates.total")}:{" "}
            {(() => {
              switch (currentTab) {
                case "all":
                  return certificatesQuery.data?.meta?.total || 0;
                case "pending":
                  return pendingCertificatesQuery.data?.meta?.total || 0;
                case "rejected":
                  return rejectedCertificatesQuery.data?.meta?.total || 0;
                case "approved":
                  return approvedCertificatesQuery.data?.meta?.total || 0;
                default:
                  return 0;
              }
            })()}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {currentTab === "pending" && (
            <div className="flex flex-row gap-2 items-center">
              {selectedPendingRows.length > 0 && role === "PDT" && (
                <Button
                  onClick={handleOpenConfirmDialog}
                  variant="default"
                  disabled={confirmMutation.isPending}
                >
                  {t("common.confirm")} ({selectedPendingRows.length})
                </Button>
              )}

              {selectedPendingRows.length > 0 && role === "PDT" && (
                <>
                  <Button
                    onClick={handleOpenRejectDialogIds}
                    variant="destructive"
                    disabled={rejectMutation.isPending}
                  >
                    {t("common.reject")} ({selectedPendingRows.length})
                  </Button>
                </>
              )}

              {selectedPendingRows.length > 0 && role === "KHOA" && (
                <>
                  <Button
                    onClick={handleOpenDeleteDialogIds}
                    variant="destructive"
                    disabled={rejectMutation.isPending}
                  >
                    {t("common.delete")} ({selectedPendingRows.length})
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                onClick={fetchAllCertificates}
                disabled={isSelectingAll}
              >
                {isSelectingAll ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("common.selectAll")
                )}
              </Button>
              {selectedPendingRows.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPendingRows([]);
                    setTableResetKey((k) => k + 1);
                  }}
                >
                  {t("common.unselectAll", "Bỏ chọn tất cả")}
                </Button>
              )}
            </div>
          )}

          {/* Nút reject cho tab all và pending */}
          {(currentTab === "all" || currentTab === "pending") &&
            selectedRows.length > 0 &&
            role === "PDT" && (
              <>
                <Button
                  onClick={handleOpenConfirmDialog}
                  variant="default"
                  disabled={confirmMutation.isPending}
                >
                  {t("common.confirm")} ({selectedRows.length})
                </Button>
                <Button
                  onClick={handleOpenRejectDialogIds}
                  variant="destructive"
                  disabled={rejectMutation.isPending}
                >
                  {t("common.reject")} ({selectedRows.length})
                </Button>
              </>
            )}
          {selectedRows.length > 0 && role === "KHOA" && (
            <Button
              onClick={handleOpenDeleteDialogIds}
              variant="destructive"
              disabled={rejectMutation.isPending}
            >
              {t("common.delete")} ({selectedRows.length})
            </Button>
          )}
          {selectedRows.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRows([]);
                setTableResetKey((k) => k + 1);
              }}
            >
              {t("common.unselectAll", "Bỏ chọn tất cả")}
            </Button>
          )}

          {role !== "PDT" && role !== "ADMIN" && (
            <>
              <ExcelUploadDialog />
              <CreateDialog />
            </>
          )}
          {role === "PDT" && <ExportDialog typeTab={currentTab} />}
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1 items-end">
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
            <Label className="mb-2">{t("certificates.nameStudent")}</Label>
            <Input
              value={filterValues.studentName}
              onChange={handleFilterChange("studentName")}
              placeholder={t("certificates.studentNamePlaceholder")}
              className="min-w-[140px]"
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
          <div className="flex flex-col">
            <Label className="mb-2">{t("certificates.diplomaNumber")}</Label>
            <Input
              value={filterValues.diplomaNumber}
              onChange={handleFilterChange("diplomaNumber")}
              placeholder={t("certificates.diplomaNumberPlaceholder")}
              className="min-w-[120px]"
            />
          </div>
        </div>
      </div>

      <Tabs
        value={currentTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="all">
            {t("certificates.allCertificates")}
          </TabsTrigger>
          {(role === "PDT" || role === "KHOA") && (
            <TabsTrigger value="approved">
              {t("certificates.approvedCertificates")}
            </TabsTrigger>
          )}
          {(role === "PDT" || role === "KHOA") && (
            <TabsTrigger value="pending">
              {t("certificates.pendingCertificates")}
            </TabsTrigger>
          )}
          {(role === "PDT" || role === "KHOA") && (
            <TabsTrigger value="rejected">
              {t("certificates.rejectedCertificates")}
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="all" className="mt-4">
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
        <TabsContent value="rejected" className="mt-4">
          {selectedRows.length > 0 && (role === "PDT" || role === "KHOA") && (
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
            key={"rejected-" + tableResetKey}
            columns={columns}
            data={rejectedCertificatesQuery.data?.items || []}
            onPaginationChange={setPagination}
            listMeta={rejectedCertificatesQuery.data?.meta}
            containerClassName="flex-1"
            isLoading={
              rejectedCertificatesQuery.isLoading &&
              !rejectedCertificatesQuery.isError
            }
            onSelectedRowsChange={setSelectedRows}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
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
        <TabsContent value="approved" className="mt-4">
          <DataTable
            key={"approved-" + tableResetKey}
            columns={columns}
            data={approvedCertificatesQuery.data?.items || []}
            onPaginationChange={setPagination}
            listMeta={approvedCertificatesQuery.data?.meta}
            containerClassName="flex-1"
            isLoading={
              approvedCertificatesQuery.isLoading &&
              !approvedCertificatesQuery.isError
            }
            onSelectedRowsChange={setSelectedPendingRows}
          />
        </TabsContent>
      </Tabs>
      {openEditDialog && searchParams.get("id") && (
        <EditDialog open={openEditDialog} id={searchParams.get("id")!} />
      )}
      {openDeleteDialog &&
        searchParams.get("id") &&
        searchParams.get("certificateName") && (
          <DeleteDialog
            open={openDeleteDialog}
            id={searchParams.get("id")!}
            certificateName={decodeURIComponent(
              searchParams.get("certificateName")!
            )}
            studentName={decodeURIComponent(searchParams.get("studentName")!)}
            onSuccess={() => {
              setSelectedRows([]);
            }}
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
        error={
          isAxiosError(confirmMutation.error)
            ? confirmMutation.error.response?.data?.message ?? ""
            : ""
        }
        loading={confirmMutation.isPending}
      />
      {/* Dialog từ chối nhiều chứng chỉ */}
      <RejectCertificateDialogIds
        open={openRejectDialogIds}
        onClose={() => setOpenRejectDialogIds(false)}
        onReject={handleRejectCertificates}
        ids={rejectIds}
        loading={rejectMutation.isPending}
      />
      <DeleteCertificateListDialog
        open={openDeleteDialogIds}
        onClose={() => {
          setOpenDeleteDialogIds(false);
          setSelectedRows([]);
          setSelectedPendingRows([]);
          setTableResetKey((k) => k + 1);
        }}
        ids={deleteIds}
      />
      {openConfirmDialog && searchParams.get("id") && (
        <ConfirmDialog
          open={openConfirmDialog}
          id={parseInt(searchParams.get("id")!)}
        />
      )}
      {openRejectDialog && searchParams.get("id") && (
        <RejectDialog
          open={openRejectDialog}
          id={parseInt(searchParams.get("id")!)}
        />
      )}
    </div>
  );
}
