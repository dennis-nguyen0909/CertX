"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { useStudentList } from "@/hooks/student/use-student-list";
import { EditDialog } from "./components/edit-dialog";
import { CreateDialog } from "./components/create-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { ImportDialog } from "./components/import-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useUrlSyncState } from "@/hooks/use-url-sync-state";
import { useSearchParams } from "next/navigation";
import { ViewDialog } from "./components/view-dialog";
import { useGuardRoute } from "@/hooks/use-guard-route";
import { ExportDialog } from "./components/export-dialog";
import { Button } from "@/components/ui/button";
import { Student } from "@/models/student";

export default function StudentListPage() {
  const { t } = useTranslation();
  const { setPagination, ...pagination } = usePaginationQuery();
  const [search, setSearch] = useUrlSyncState("search");
  const [studentCode, setStudentCode] = useUrlSyncState("studentCode");
  const [className, setClassName] = useUrlSyncState("className");
  const [departmentName, setDepartmentName] = useUrlSyncState("departmentName");

  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [tableResetKey, setTableResetKey] = useState(0);

  // State for ExportDialog
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportStudentIds, setExportStudentIds] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const role = useSelector((state: RootState) => state.user.role);

  // Main paginated student list
  const {
    data: listData,
    isLoading: isLoadingListData,
    isError,
  } = useStudentList({
    ...pagination,
    name: search || undefined,
    studentCode: studentCode || undefined,
    className: className || undefined,
    departmentName: role === "KHOA" ? undefined : departmentName || undefined,
  });

  // Hook to get ALL students for export all (fetch all ids)
  const { data: allStudentsData, isLoading: isLoadingAllStudents } =
    useStudentList({
      pageIndex: 1,
      pageSize: 100000, // Large enough to get all, adjust as needed
      name: search || undefined,
      studentCode: studentCode || undefined,
      className: className || undefined,
      departmentName: role === "KHOA" ? undefined : departmentName || undefined,
    });

  useGuardRoute();

  const columns = useColumns({
    t,
    onView: (student: Student) => {
      setSelectedStudents([student]);
    },
    onEdit: (student: Student) => {
      setSelectedStudents([student]);
    },
    onDelete: (student: Student) => {
      setSelectedStudents([student]);
    },
  });

  const openEditDialog =
    searchParams.get("action") === "edit" && searchParams.has("id");

  const openDeleteDialog =
    searchParams.get("action") === "delete" && searchParams.has("id");

  // Unselect all handler
  const handleUnselectAll = () => {
    setSelectedStudents([]);
    setTableResetKey((k) => k + 1);
  };

  // Handler for Export All
  const handleExportAll = () => {
    if (!allStudentsData?.items?.length) return;
    setExportStudentIds(
      allStudentsData.items.map((s: Student) => String(s.id))
    );
    setExportDialogOpen(true);
  };

  // Handler for Export Selected
  const handleExportSelected = () => {
    setExportStudentIds(selectedStudents.map((s) => String(s.id)));
    setExportDialogOpen(true);
  };

  // Close ExportDialog
  const handleCloseExportDialog = () => {
    setExportDialogOpen(false);
    setExportStudentIds([]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-2xl font-bold">{t("student.management")}</h1>
          <p className="text-sm text-gray-500">
            {t("common.total")}: {listData?.meta?.total || 0}
          </p>
        </div>
        {(role === "PDT" || role === "KHOA") && (
          <div className="flex gap-2 flex-wrap items-center">
            {role === "PDT" && (
              <>
                <CreateDialog />
                <ImportDialog />
              </>
            )}
            <Button
              variant="outline"
              onClick={handleExportSelected}
              disabled={selectedStudents.length === 0}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t("student.exportExcel", "Xuất Excel")}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportAll}
              disabled={isLoadingAllStudents || !allStudentsData?.items?.length}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isLoadingAllStudents
                ? t("common.loading", "Đang tải...")
                : t("common.exportExcelAll", "Xuất tất cả")}
            </Button>
            {selectedStudents.length > 0 && (
              <Button
                variant="outline"
                onClick={handleUnselectAll}
                className="w-full sm:w-auto"
              >
                {t("common.unselectAll", "Bỏ chọn tất cả")}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4 flex-wrap sm:flex-nowrap">
        <div className="relative sm:w-1/4 w-full">
          <span className="absolute left-2 top-2.5 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </span>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("student.searchByName")}
            className="pl-8"
          />
        </div>

        <div className="relative sm:w-1/4 w-full">
          <span className="absolute left-2 top-2.5 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </span>
          <Input
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            placeholder={t("student.searchByCode")}
            className="pl-8"
          />
        </div>

        <div className="relative sm:w-1/4 w-full">
          <span className="absolute left-2 top-2.5 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </span>
          <Input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder={t("student.searchByClass")}
            className="pl-8"
          />
        </div>

        {role !== "KHOA" && (
          <div className="relative sm:w-1/4 w-full">
            <span className="absolute left-2 top-2.5 flex items-center">
              <Search className="h-4 w-4 text-muted-foreground" />
            </span>
            <Input
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder={t("student.searchByDepartment")}
              className="pl-8"
            />
          </div>
        )}
      </div>

      <DataTable
        key={tableResetKey}
        columns={columns}
        data={listData?.items || []}
        onPaginationChange={setPagination}
        listMeta={listData?.meta}
        containerClassName="flex-1"
        isLoading={isLoadingListData && !isError}
        onSelectedRowsChange={setSelectedStudents}
      />

      {/* ExportDialog for both selected and all */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={handleCloseExportDialog}
        selectedStudentIds={exportStudentIds}
      />

      {openEditDialog && searchParams.get("id") && (
        <EditDialog open={openEditDialog} id={searchParams.get("id")!} />
      )}

      {searchParams.get("action") === "view" && searchParams.get("id") && (
        <ViewDialog open={true} id={searchParams.get("id")!} />
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
    </div>
  );
}
