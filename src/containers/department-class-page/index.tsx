"use client";
import { useInfiniteClassOfDepartment } from "@/hooks/student/use-infinite-class-of-department";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { useColumns } from "./use-columns";
import { DataTable } from "@/components/data-table";
import { CreateDialog } from "./components/create-dialog";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import React from "react";
import { EditDialog } from "./components/edit-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { ImportDialog } from "./components/import-dialog";

export default function DepartmentClassesPage() {
  const { t } = useTranslation();
  const params = useParams();
  const departmentId = params.departmentId as string;
  const { /* pageIndex, */ pageSize, setPagination } = usePaginationQuery();
  const { data, isLoading } = useInfiniteClassOfDepartment({
    departmentId,
    pageSize,
  });
  const listData = data?.pages?.[0];
  const columns = useColumns(t);
  const router = useRouter();
  const departmentName = useSearchParams().get("departmentName");
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const editId = searchParams.get("id");
  const editClassName = searchParams.get("className");
  const openEditDialog = action === "edit" && !!editId;
  const openDeleteDialog = action === "delete" && !!editId && !!editClassName;
  const classData =
    editId && editClassName
      ? { id: parseInt(editId), className: decodeURIComponent(editClassName) }
      : undefined;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 h-8 w-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">{t("common.back")}</span>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {departmentName
            ? `Danh sách lớp - ${departmentName}`
            : t("class.management")}
        </h1>
        <div className="ml-auto flex gap-2">
          <ImportDialog departmentId={departmentId} />
          <CreateDialog departmentId={departmentId} />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={listData?.items || []}
        onPaginationChange={setPagination}
        listMeta={listData?.meta}
        containerClassName="min-h-[400px]"
        isLoading={isLoading}
      />
      {openEditDialog && editId && (
        <EditDialog open={openEditDialog} id={editId} classData={classData} />
      )}
      {openDeleteDialog && editId && editClassName && (
        <DeleteDialog
          open={openDeleteDialog}
          id={editId}
          className={decodeURIComponent(editClassName)}
        />
      )}
    </div>
  );
}
