"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useUniversityDepartmentList } from "@/hooks/university/use-university-department-list";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { UserOfDepartment } from "@/models/user";
import { usePaginationQuery } from "@/hooks/use-pagination-query";
import { Button } from "@/components/ui/button";

export default function DepartmentUniversityListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const universityId = Number(searchParams.get("universityId"));
  const { pageIndex, pageSize, setPagination } = usePaginationQuery();
  const { data, isLoading, isError, error } = useUniversityDepartmentList(
    universityId,
    { page: pageIndex + 1, size: pageSize }
  );

  const columns: ColumnDef<UserOfDepartment>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Tên khoa" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "locked",
      header: "Trạng thái",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.locked
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          {row.original.locked ? "Đã khóa" : "Hoạt động"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(
              `/class-university-list?departmentId=${row.original.id}`
            )
          }
        >
          Xem danh sách lớp
        </Button>
      ),
    },
  ];

  if (!universityId) return <div>Không tìm thấy trường đại học</div>;
  if (isError) return <div>Lỗi: {error?.message}</div>;

  return (
    <div className="p-4">
      <Button variant="outline" className="mb-4" onClick={() => router.back()}>
        Quay lại
      </Button>
      <h1 className="text-2xl font-bold mb-4">Danh sách khoa của trường</h1>
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
