"use client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Download } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStudentList } from "@/hooks/student/use-student-list";
import { EditDialog } from "./components/edit-dialog";
import { CreateDialog } from "./components/create-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { ViewDialog } from "./components/view-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGuardRoute } from "@/hooks/use-guard-route";
import { ImportDialog } from "../student-list-page/components/import-dialog";
import { ExportDialog } from "../student-list-page/components/export-dialog";
import { Student } from "@/models/student";

interface ClassStudentsPageProps {
  className: string;
  classId: number;
}

export default function ClassStudentsPage({
  className,
  classId,
}: ClassStudentsPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { setPagination, ...pagination } = usePaginationQuery();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [departmentName, setDepartmentName] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const [debouncedDepartmentName, setDebouncedDepartmentName] =
    useState<string>(departmentName);

  // Export dialog state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportStudentIds, setExportStudentIds] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [tableResetKey, setTableResetKey] = useState(0);

  const {
    data: listData,
    isLoading: isLoadingListData,
    isError,
  } = useStudentList({
    ...pagination,
    name: debouncedSearch,
    className: className, // Fixed className from props
    departmentName: debouncedDepartmentName,
  });

  // Fetch all students in this class for export all
  const { data: allStudentsData, isLoading: isLoadingAllStudents } =
    useStudentList({
      pageIndex: 1,
      pageSize: 100000,
      name: debouncedSearch || undefined,
      className: className,
      departmentName: debouncedDepartmentName || undefined,
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
      setDebouncedDepartmentName(departmentName);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [departmentName]);

  const handleBackToClassList = () => {
    router.back();
  };

  // Export handlers
  const handleExportAll = () => {
    if (!allStudentsData?.items?.length) return;
    setExportStudentIds(
      allStudentsData.items.map((s: Student) => String(s.id))
    );
    setExportDialogOpen(true);
  };

  const handleExportSelected = () => {
    setExportStudentIds(selectedStudents.map((s) => String(s.id)));
    setExportDialogOpen(true);
  };

  const handleCloseExportDialog = () => {
    setExportDialogOpen(false);
    setExportStudentIds([]);
  };

  // Unselect all handler
  const handleUnselectAll = () => {
    setSelectedStudents([]);
    setTableResetKey((k) => k + 1);
  };

  useGuardRoute();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 h-8 w-8"
            onClick={handleBackToClassList}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">{t("common.back")}</span>
          </Button>
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
              {t("class.studentList")}
              <Badge variant="secondary" className="text-base">
                {className}
              </Badge>
            </h1>
            <p className="text-sm text-gray-500">
              {t("common.total")}: {listData?.meta.total}{" "}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <CreateDialog
            defaultClassName={className}
            classId={classId.toString()}
          />
          <ImportDialog
          // defaultClassName={className}
          // classId={classId.toString()}
          />
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("student.searchByName")}
            className="pl-10"
          />
        </div>
        <Input
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder={t("student.searchByDepartment")}
        />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <DataTable
          key={tableResetKey}
          columns={columns}
          data={listData?.items || []}
          onPaginationChange={setPagination}
          listMeta={listData?.meta}
          containerClassName="min-h-[400px]"
          isLoading={isLoadingListData && !isError}
          onSelectedRowsChange={setSelectedStudents}
        />
      </div>

      {/* ExportDialog for both selected and all */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={handleCloseExportDialog}
        selectedStudentIds={exportStudentIds}
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
        <ViewDialog open={openViewDialog} id={searchParams.get("id")!} />
      )}
    </div>
  );
}
