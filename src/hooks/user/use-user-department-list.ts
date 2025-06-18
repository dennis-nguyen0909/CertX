import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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

export function useInfiniteUserDepartmentList({
  pageSize = 10,
  name,
  sort,
}: {
  pageSize?: number;
  name?: string;
  sort?: string[];
}) {
  const { UserService } = useServices();

  return useInfiniteQuery({
    queryKey: ["infinite-user-department-list", pageSize, name, sort],
    queryFn: ({ pageParam = 1 }) =>
      UserService.getUserOfDepartment(
        pageParam - 1,
        pageSize,
        name || "",
        sort || []
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.meta.current_page < lastPage.meta.total_pages
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}
