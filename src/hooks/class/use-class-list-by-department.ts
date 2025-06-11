import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useClassListByDepartment({
  pageIndex,
  pageSize,
  className,
}: // sort,
{
  pageIndex: number;
  pageSize: number;
  className?: string;
  // sort?: string[];
}) {
  const { ClassService } = useServices();

  return useQuery({
    queryKey: [
      "class-list-by-department",
      pageIndex,
      pageSize,
      className,
      // sort,
    ],
    queryFn: () =>
      ClassService.findByDepartment(
        pageIndex,
        pageSize,
        className || ""
        // sort || []
      ),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
