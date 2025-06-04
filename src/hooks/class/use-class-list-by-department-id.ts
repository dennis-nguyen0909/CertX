import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useClassListByDepartmentId({
  departmentId,
  pageIndex,
  pageSize,
  className,
  sort,
}: {
  departmentId: number;
  pageIndex: number;
  pageSize: number;
  className?: string;
  sort?: string[];
}) {
  const { ClassService } = useServices();

  return useQuery({
    queryKey: [
      "class-list-by-department-id",
      departmentId,
      pageIndex,
      pageSize,
      className,
      sort,
    ],
    queryFn: () =>
      ClassService.findByDepartmentId(
        departmentId,
        pageIndex,
        pageSize,
        className || "",
        sort || []
      ),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
