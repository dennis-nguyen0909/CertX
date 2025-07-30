"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Class } from "@/models/class";
import { Button } from "@/components/ui/button";
import { useClassListByDepartmentId } from "@/hooks/class";
import { useGuardRoute } from "@/hooks/use-guard-route";

const columns: ColumnDef<Class>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "className", header: "Tên lớp" },
];

export default function ClassUniversityListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const departmentId = Number(searchParams.get("departmentId"));
  const { pageIndex, pageSize, setPagination } = usePaginationQuery();
  const { data, isLoading, isError, error } = useClassListByDepartmentId({
    departmentId,
    pageIndex,
    pageSize,
  });
  useGuardRoute();

  if (!departmentId) return <div>Không tìm thấy khoa</div>;
  if (isError) return <div>Lỗi: {error?.message}</div>;

  return (
    <div className="p-4">
      <Button variant="outline" className="mb-4" onClick={() => router.back()}>
        Quay lại
      </Button>
      <h1 className="text-2xl font-bold mb-4">Danh sách lớp của khoa</h1>
      <DataTable
        columns={columns}
        data={data?.items || []}
        onPaginationChange={setPagination}
        listMeta={data?.meta}
        isLoading={isLoading}
      />
    </div>
  );
}
