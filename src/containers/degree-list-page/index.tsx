"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { useColumns } from "./use-columns";
import { Degree } from "@/models/degree";
import { CreateDialog } from "./components/create-dialog";
import { ExcelUploadDialog } from "./components/excel-upload-dialog";
import { EditDialog } from "./components/edit-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { ViewDialog } from "./components/view-dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDegreeList, useDegreePendingList } from "@/hooks/degree";
import { DegreeSearchParams } from "@/services/degree/degree.service";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "./components/confirm-dialog";
import { ConfirmDegreeDialogIds } from "./components/confirm-degree-dialog-ids";
import { useDegreeConfirmList } from "@/hooks/degree/use-degree-confirm-list";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useDegreeDetail } from "@/hooks/degree/use-degree-detail";
import { useSearchParams, useRouter } from "next/navigation";
import { RejectDialog } from "./components/reject-dialog";
import { useDegreeRejectedList } from "@/hooks/degree/use-degree-rejected-list";
import { useDegreeApprovedList } from "@/hooks/degree/use-degree-approved-list";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";
import { useGuardRoute } from "@/hooks/use-guard-route";
import { DegreeService } from "@/services/degree/degree.service";

export default function DegreeListPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedDegrees, setSelectedDegrees] = useState<Degree[]>([]);
  const [filterValues, setFilterValues] = useState({
    studentName: "",
    departmentName: "",
    className: "",
    studentCode: "",
    graduationYear: "",
    diplomaNumber: "",
  });
  const [debouncedFilterValues, setDebouncedFilterValues] =
    useState(filterValues);
  const [openConfirmIdsDialog, setOpenConfirmIdsDialog] = useState(false);
  const confirmMutation = useDegreeConfirmList();

  const updateQueryClientDegree = useInvalidateByKey("degree");
  const role = useSelector((state: RootState) => state.user.role) || "KHOA";
  const [currentTab, setCurrentTab] = useState("all");
  const searchParams = useSearchParams();
  const router = useRouter();
  useGuardRoute();
  const [isSelectingAll, setIsSelectingAll] = useState(false);
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

  // Reset pagination when tab changes và update URL
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

  // Debounce filter values
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilterValues(filterValues);
    }, 500);
    return () => clearTimeout(handler);
  }, [filterValues]);

  // Fetch data using hooks
  const { data: allDegreesData, isLoading: isLoadingAll } = useDegreeList({
    role: role.toLowerCase(),
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    ...debouncedFilterValues,
  });

  const { data: pendingDegreesData, isLoading: isLoadingPending } =
    useDegreePendingList({
      role: role.toLowerCase(),
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      ...debouncedFilterValues,
    });

  const { data: rejectedDegreesData, isLoading: isLoadingRejected } =
    useDegreeRejectedList({
      role: role.toLowerCase(),
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      ...debouncedFilterValues,
    });

  const { data: approvedDegreesData, isLoading: isLoadingApproved } =
    useDegreeApprovedList({
      role: role.toLowerCase(),
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      ...debouncedFilterValues,
    });

  // Get degree id from URL for dialogs
  const dialogId = searchParams.get("id")
    ? parseInt(searchParams.get("id")!)
    : undefined;
  const { data: dialogDegree, isLoading: isLoadingDialogDegree } =
    useDegreeDetail(dialogId || 0);

  // Filter handlers
  const handleFilterChange =
    (field: keyof DegreeSearchParams) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const openRejectDialog =
    searchParams.get("action") === "reject" && searchParams.has("id");

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openViewDialog =
    searchParams.get("action") === "view" && searchParams.has("id");

  const openConfirmDialog =
    searchParams.get("action") === "confirm" && searchParams.has("id");

  // Columns with action handlers
  const columns = useColumns({
    t,
    onView: (degree: Degree) => {
      setSelectedDegrees([degree]);
    },
    onEdit: (degree: Degree) => {
      setSelectedDegrees([degree]);
    },
    onDelete: (degree: Degree) => {
      setSelectedDegrees([degree]);
    },
    onConfirm: (degree: Degree) => {
      setSelectedDegrees([degree]);
    },
    currentTab,
    searchParams,
  });

  // Hàm lấy toàn bộ degrees cho tab pending
  const fetchAllPendingDegrees = async () => {
    setIsSelectingAll(true);
    let allItems: Degree[] = [];
    const size = 100;
    let total = 0;
    const params: DegreeSearchParams = {
      page: 1,
      size,
      ...debouncedFilterValues,
    };
    let firstPage;
    if (role.toLowerCase() === "pdt") {
      firstPage = await DegreeService.getPDTPendingDegreeList(params);
    } else {
      firstPage = await DegreeService.getKhoaPendingDegreeList(params);
    }
    total = firstPage.meta?.total || 0;
    allItems = firstPage.items || [];
    const totalPages = Math.ceil(total / size);
    if (totalPages > 1) {
      const promises = [];
      for (let p = 2; p <= totalPages; p++) {
        if (role.toLowerCase() === "pdt") {
          promises.push(
            DegreeService.getPDTPendingDegreeList({ ...params, page: p })
          );
        } else {
          promises.push(
            DegreeService.getKhoaPendingDegreeList({ ...params, page: p })
          );
        }
      }
      const results = await Promise.all(promises);
      results.forEach((res: { items?: Degree[] }) => {
        if (res.items) allItems = allItems.concat(res.items);
      });
    }
    setSelectedDegrees(allItems);
    setIsSelectingAll(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{t("degrees.management")}</h1>
          <p className="text-sm text-gray-500">
            {t("degrees.total")}:{" "}
            {(() => {
              switch (currentTab) {
                case "all":
                  return allDegreesData?.meta?.total || 0;
                case "pending":
                  return pendingDegreesData?.meta?.total || 0;
                case "rejected":
                  return rejectedDegreesData?.meta?.total || 0;
                case "approved":
                  return approvedDegreesData?.meta?.total || 0;
                default:
                  return 0;
              }
            })()}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {currentTab === "pending" && (
            <div className="flex flex-row gap-2 items-center">
              {selectedDegrees.length > 0 && (
                <Button
                  onClick={() => setOpenConfirmIdsDialog(true)}
                  disabled={confirmMutation.isPending}
                >
                  {t("degrees.confirmAction")} ({selectedDegrees.length})
                </Button>
              )}
              <Button
                variant="outline"
                onClick={fetchAllPendingDegrees}
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
            </div>
          )}
          {role !== "PDT" && role !== "ADMIN" && (
            <>
              <ExcelUploadDialog />
              <Button onClick={() => setOpenCreate(true)}>
                <Plus className="w-4 h-4 mr-2" /> {t("degrees.create")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1 items-end">
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.studentCode")}</Label>
            <Input
              value={filterValues.studentCode}
              onChange={handleFilterChange("studentCode")}
              placeholder={t("degrees.studentCodePlaceholder")}
              className="min-w-[120px]"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.studentName")}</Label>
            <Input
              value={filterValues.studentName}
              onChange={handleFilterChange("studentName")}
              placeholder={t("degrees.studentNamePlaceholder")}
              className="min-w-[140px]"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.className")}</Label>
            <Input
              value={filterValues.className}
              onChange={handleFilterChange("className")}
              placeholder={t("degrees.classNamePlaceholder")}
              className="min-w-[120px]"
            />
          </div>

          {role === "PDT" && (
            <div className="flex flex-col">
              <Label className="mb-2">{t("degrees.department")}</Label>
              <Input
                value={filterValues.departmentName}
                onChange={handleFilterChange("departmentName")}
                placeholder={t("degrees.departmentPlaceholder")}
                className="min-w-[140px]"
              />
            </div>
          )}
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.diplomaNumber")}</Label>
            <Input
              value={filterValues.diplomaNumber}
              onChange={handleFilterChange("diplomaNumber")}
              placeholder={t("degrees.diplomaNumberPlaceholder")}
              className="min-w-[100px]"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.graduationYear")}</Label>
            <Input
              value={filterValues.graduationYear}
              onChange={handleFilterChange("graduationYear")}
              placeholder={t("degrees.graduationYearPlaceholder")}
              className="min-w-[100px]"
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
          <TabsTrigger value="all">{t("degrees.allDegrees")}</TabsTrigger>

          <TabsTrigger value="approved">
            {t("degrees.approvedDegrees")}
          </TabsTrigger>
          <TabsTrigger value="pending">
            {t("degrees.pendingDegrees")}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            {t("degrees.rejectedDegrees")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {selectedDegrees.length > 0 && (
            <Button
              className="mb-2"
              onClick={() => setOpenConfirmIdsDialog(true)}
              disabled={confirmMutation.isPending}
            >
              {t("degrees.confirmAction")} ({selectedDegrees.length})
            </Button>
          )}
          <DataTable
            columns={columns}
            data={allDegreesData?.items || []}
            onPaginationChange={setPagination}
            listMeta={allDegreesData?.meta}
            isLoading={isLoadingAll}
            containerClassName="flex-1"
            onSelectedRowsChange={setSelectedDegrees}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          {selectedDegrees.length > 0 && (
            <Button
              className="mb-2"
              onClick={() => setOpenConfirmIdsDialog(true)}
              disabled={confirmMutation.isPending}
            >
              {t("degrees.confirmAction")} ({selectedDegrees.length})
            </Button>
          )}
          <DataTable
            columns={columns}
            data={pendingDegreesData?.items || []}
            onPaginationChange={setPagination}
            listMeta={pendingDegreesData?.meta}
            isLoading={isLoadingPending}
            containerClassName="flex-1"
            onSelectedRowsChange={setSelectedDegrees}
          />
        </TabsContent>
        <TabsContent value="rejected" className="mt-4">
          <DataTable
            columns={columns}
            data={rejectedDegreesData?.items || []}
            onPaginationChange={setPagination}
            listMeta={rejectedDegreesData?.meta}
            isLoading={isLoadingRejected}
            containerClassName="flex-1"
            onSelectedRowsChange={setSelectedDegrees}
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-4">
          <DataTable
            columns={columns}
            data={approvedDegreesData?.items || []}
            onPaginationChange={setPagination}
            listMeta={approvedDegreesData?.meta}
            isLoading={isLoadingApproved}
            containerClassName="flex-1"
          />
        </TabsContent>
      </Tabs>

      <CreateDialog open={openCreate} onClose={() => setOpenCreate(false)} />
      {openEditDialog && dialogId && (
        <EditDialog open={openEditDialog} id={dialogId} />
      )}
      {searchParams.get("action") === "delete" && dialogId && (
        <DeleteDialog
          open={true}
          onClose={() => router.back()}
          onDelete={() => {}}
          name={dialogDegree?.nameStudent || ""}
        />
      )}
      {openViewDialog && dialogId && (
        <ViewDialog
          open={openViewDialog}
          onClose={() => router.back()}
          degree={dialogDegree || null}
          loading={isLoadingDialogDegree}
        />
      )}
      {openConfirmDialog && dialogId && dialogDegree && (
        <ConfirmDialog
          open={openConfirmDialog}
          onClose={() => router.back()}
          degree={dialogDegree}
        />
      )}
      <ConfirmDegreeDialogIds
        open={openConfirmIdsDialog}
        onClose={() => {
          setOpenConfirmIdsDialog(false);
        }}
        onConfirm={() => {
          confirmMutation.mutate(
            selectedDegrees.map((d) => d.id),
            {
              onSuccess: () => {
                setOpenConfirmIdsDialog(false);
                setSelectedDegrees([]);
                updateQueryClientDegree();
              },
              onError: (error) => {
                console.error("Error confirming degrees:", error);
              },
            }
          );
        }}
        ids={selectedDegrees.map((d) => d.id)}
        loading={confirmMutation.isPending}
      />
      {openRejectDialog && searchParams.get("id") && (
        <RejectDialog
          open={openRejectDialog}
          id={parseInt(searchParams.get("id")!)}
        />
      )}
    </div>
  );
}
