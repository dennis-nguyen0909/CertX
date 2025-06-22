import { useInfiniteQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

interface UseInfiniteClassOfDepartmentProps {
  departmentId: string;
  pageSize: number;
  name?: string;
}

export const useInfiniteClassOfDepartment = ({
  departmentId,
  pageSize,
  name,
}: UseInfiniteClassOfDepartmentProps) => {
  const { StudentService } = useServices();

  return useInfiniteQuery({
    queryKey: ["class-of-department", { departmentId, name, pageSize }],
    queryFn: ({ pageParam = 1 }) =>
      StudentService.getClassOfDepartment(
        departmentId,
        pageParam,
        pageSize,
        name
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.meta.nextPage) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: !!departmentId,
  });
};
