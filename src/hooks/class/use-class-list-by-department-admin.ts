import { useQuery } from "@tanstack/react-query";
import { ClassService } from "@/services/class/class.service";
import { Class } from "@/models/class";
import { PaginatedListResponse } from "@/models/common";

export function useClassListByDepartmentAdmin(
  departmentId: number,
  pageIndex: number,
  pageSize: number,
  className?: string
) {
  return useQuery<PaginatedListResponse<Class>, Error>({
    queryKey: [
      "class-list-by-department-admin",
      departmentId,
      pageIndex,
      pageSize,
      className,
    ],
    queryFn: () =>
      ClassService.findByDepartmentId(
        departmentId,
        pageIndex,
        pageSize,
        className
      ),
    enabled: !!departmentId,
  });
}
