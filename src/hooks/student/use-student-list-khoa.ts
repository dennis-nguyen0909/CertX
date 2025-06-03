import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useStudentListKhoa({
  pageIndex,
  pageSize,
  name,
  className,
  sort,
}: {
  pageIndex: number;
  pageSize: number;
  name?: string;
  className?: string;
  sort?: string[];
}) {
  const { StudentService } = useServices();

  return useQuery({
    queryKey: ["student-list-khoa", pageIndex, pageSize, name, className, sort],
    queryFn: () =>
      StudentService.getStudentsList(
        pageIndex,
        pageSize,
        name || "",
        className || "",
        sort || []
      ),
  });
}
