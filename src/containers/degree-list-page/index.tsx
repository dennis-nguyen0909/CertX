"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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
import { useSearchParams } from "next/navigation";
import { RejectDialog } from "./components/reject-dialog";
import { useDegreeRejectedList } from "@/hooks/degree/use-degree-rejected-list";
import { useDegreeApprovedList } from "@/hooks/degree/use-degree-approved-list";
import { useInvalidateByKey } from "@/hooks/use-invalidate-by-key";

export default function DegreeListPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
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
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [degreeToConfirm, setDegreeToConfirm] = useState<Degree | null>(null);
  const [selectedDegrees, setSelectedDegrees] = useState<Degree[]>([]);
  const [openConfirmIdsDialog, setOpenConfirmIdsDialog] = useState(false);
  const confirmMutation = useDegreeConfirmList();

  const updateQueryClientDegree = useInvalidateByKey("degree");
  const role = useSelector((state: RootState) => state.user.role) || "KHOA";
  const [currentTab, setCurrentTab] = useState("all");
  const searchParams = useSearchParams();
  // Reset pagination when tab changes
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
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

  const { data: degreeDetail, isLoading: isLoadingDegreeDetail } =
    useDegreeDetail(selectedDegree?.id || 0);

  // Filter handlers
  const handleFilterChange =
    (field: keyof DegreeSearchParams) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleDelete = () => {
    if (selectedDegree) {
      setOpenDelete(false);
    }
  };

  const openRejectDialog =
    searchParams.get("action") === "reject" && searchParams.has("id");

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  // Columns with action handlers
  const columns = useColumns({
    t,
    onView: (degree: Degree) => {
      setSelectedDegree(degree);
      setOpenView(true);
    },
    onEdit: (degree: Degree) => {
      setSelectedDegree(degree);
    },
    onDelete: (degree: Degree) => {
      setSelectedDegree(degree);
      setOpenDelete(true);
    },
    onConfirm: (degree: Degree) => {
      setDegreeToConfirm(degree);
      setOpenConfirmDialog(true);
    },
  });

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
        {role !== "PDT" && role !== "ADMIN" && (
          <div className="flex gap-2">
            <ExcelUploadDialog />
            <Button onClick={() => setOpenCreate(true)}>
              <Plus className="w-4 h-4 mr-2" /> {t("degrees.create")}
            </Button>
          </div>
        )}
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
        defaultValue="all"
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
      {openEditDialog && (
        <EditDialog
          open={openEditDialog}
          id={parseInt(searchParams.get("id")!)}
        />
      )}
      {selectedDegree && (
        <DeleteDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onDelete={handleDelete}
          name={selectedDegree.nameStudent}
        />
      )}
      {selectedDegree && (
        <ViewDialog
          open={openView}
          onClose={() => setOpenView(false)}
          loading={isLoadingDegreeDetail}
          degree={degreeDetail || selectedDegree}
        />
      )}
      {degreeToConfirm && (
        <ConfirmDialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          title={t("degrees.confirmAction")}
          description={t("degrees.confirmActionDescription", {
            name: degreeToConfirm.nameStudent,
          })}
          degree={degreeToConfirm}
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
