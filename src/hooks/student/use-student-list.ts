import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useStudentList({
  pageIndex,
  pageSize,
  name,
  className,
  departmentName,
  sort,
}: {
  pageIndex: number;
  pageSize: number;
  name?: string;
  className?: string;
  departmentName?: string;
  sort?: string[];
}) {
  const { StudentService } = useServices();

  return useQuery({
    queryKey: [
      "student-list",
      pageIndex,
      pageSize,
      name,
      className,
      departmentName,
      sort,
    ],
    queryFn: () =>
      StudentService.getStudentsOfUniversity(
        pageIndex,
        pageSize,
        name || "",
        className || "",
        departmentName || "",
        sort || []
      ),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
