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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClassStudentsPageProps {
  className: string;
}

export default function ClassStudentsPage({
  className,
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
    router.push("/class-list");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToClassList}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.back") || "Quay lại"}
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("class.studentList") || "Danh sách sinh viên"}
          </h1>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {className}
          </Badge>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {t("class.studentListDescription") ||
            `Danh sách sinh viên thuộc lớp ${className}`}
        </p>
        <CreateDialog defaultClassName={className} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("student.searchByName")}
            className="pl-10 h-12"
          />
        </div>

        <Input
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder={t("student.searchByDepartment")}
          className="flex-1 h-12"
        />
      </div>

      <div className="border rounded-lg">
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
    </div>
  );
}
