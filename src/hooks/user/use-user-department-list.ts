import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUserDepartmentList({
  pageIndex,
  pageSize,
  name,
  sort,
}: {
  pageIndex: number;
  pageSize: number;
  name?: string;
  sort?: string[];
}) {
  const { UserService } = useServices();

  return useQuery({
    queryKey: ["user-department-list", pageIndex, pageSize, name, sort],
    queryFn: () =>
      UserService.getUserOfDepartment(
        pageIndex,
        pageSize,
        name || "",
        sort || []
      ),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
