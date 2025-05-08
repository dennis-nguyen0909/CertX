import { useQuery } from "@tanstack/react-query";
import { DepartmentService } from "@/services/departments/departments.service";
import { Department } from "@/models/departments";

interface UseDepartmentsListParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  sort?: string[];
}

interface DepartmentsListResponse {
  items: Department[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export function useDepartmentsList(params: UseDepartmentsListParams) {
  return useQuery<DepartmentsListResponse>({
    queryKey: ["departments", params],
    queryFn: () => DepartmentService.find(params),
  });
}
