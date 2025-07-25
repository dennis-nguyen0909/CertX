import { useInfiniteQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

interface UseInfiniteDepartmentListProps {
  role: string;
  pageSize: number;
  name?: string;
}

export const useInfiniteDepartmentList = ({
  role,
  pageSize,
  name,
}: UseInfiniteDepartmentListProps) => {
  const { UserService } = useServices();

  return useInfiniteQuery({
    queryKey: ["department-list", { role, name, pageSize }],
    queryFn: ({ pageParam = 1 }) =>
      UserService.getUserOfDepartment(pageParam - 1, pageSize, name || "", []),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.meta?.current_page < lastPage.meta?.total_pages
        ? lastPage.meta.current_page + 1
        : undefined;
    },
  });
};
