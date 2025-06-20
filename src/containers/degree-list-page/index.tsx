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
import { useQueryClient } from "@tanstack/react-query";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useDegreeDetail } from "@/hooks/degree/use-degree-detail";

export default function DegreeListPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
  const [filterValues, setFilterValues] = useState({
    studentName: "",
    departmentName: "",
    className: "",
    studentCode: "",
    graduationYear: "",
  });
  const [debouncedFilterValues, setDebouncedFilterValues] =
    useState(filterValues);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [degreeToConfirm, setDegreeToConfirm] = useState<Degree | null>(null);
  const [selectedDegrees, setSelectedDegrees] = useState<Degree[]>([]);
  const [openConfirmIdsDialog, setOpenConfirmIdsDialog] = useState(false);
  const confirmMutation = useDegreeConfirmList();
  const queryClient = useQueryClient();
  const role = useSelector((state: RootState) => state.user.role) || "KHOA";
  const [currentTab, setCurrentTab] = useState("all");

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

  const handleEdit = () => {
    setOpenEdit(false);
  };

  const handleDelete = () => {
    if (selectedDegree) {
      setOpenDelete(false);
    }
  };

  // Columns with action handlers
  const columns = useColumns({
    t,
    onView: (degree: Degree) => {
      setSelectedDegree(degree);
      setOpenView(true);
    },
    onEdit: (degree: Degree) => {
      setSelectedDegree(degree);
      setOpenEdit(true);
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
            {currentTab === "all"
              ? allDegreesData?.meta?.total || 0
              : pendingDegreesData?.meta?.total || 0}
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
            <Label className="mb-2">{t("degrees.studentName")}</Label>
            <Input
              value={filterValues.studentName}
              onChange={handleFilterChange("studentName")}
              placeholder={t("degrees.studentNamePlaceholder")}
              className="min-w-[140px]"
            />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">{t("degrees.department")}</Label>
            <Input
              value={filterValues.departmentName}
              onChange={handleFilterChange("departmentName")}
              placeholder={t("degrees.departmentPlaceholder")}
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
          {role !== "KHOA" && (
            <TabsTrigger value="pending">
              {t("degrees.pendingDegrees")}
            </TabsTrigger>
          )}
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

        {role !== "KHOA" && (
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
        )}
      </Tabs>

      <CreateDialog open={openCreate} onClose={() => setOpenCreate(false)} />
      {selectedDegree && (
        <EditDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          degree={selectedDegree}
          onEdit={handleEdit}
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
                queryClient.invalidateQueries({
                  queryKey: ["degree-list"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["degree-pending-list"],
                });
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
    </div>
  );
}
