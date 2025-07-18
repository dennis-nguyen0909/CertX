"use client";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
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
          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
            {t("class.studentList")}
            <Badge variant="secondary" className="text-base">
              {className}
            </Badge>
          </h1>
        </div>
        <div className="flex gap-2">
          <ImportDialog
          // defaultClassName={className}
          // classId={classId.toString()}
          />
          <CreateDialog
            defaultClassName={className}
            classId={classId.toString()}
          />
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
          columns={columns}
          data={listData?.items || []}
          onPaginationChange={setPagination}
          listMeta={listData?.meta}
          containerClassName="min-h-[400px]"
          isLoading={isLoadingListData && !isError}
        />
      </div>

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
