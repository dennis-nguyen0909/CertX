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
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage?.items?.length === pageSize ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });
};
