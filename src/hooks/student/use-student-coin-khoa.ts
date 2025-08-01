import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useStudentListCoinKhoa({
  pageIndex,
  pageSize,
  name,
  className,
  sort,
  studentCode,
  departmentName,
}: {
  pageIndex: number;
  pageSize: number;
  name?: string;
  className?: string;
  sort?: string[];
  studentCode?: string;
  departmentName?: string;
}) {
  const { StudentService } = useServices();

  return useQuery({
    queryKey: [
      "student-list-coin-khoa",
      pageIndex,
      pageSize,
      name,
      className,
      sort,
      studentCode,
      departmentName,
    ],
    queryFn: () =>
      StudentService.getStudentsListCoin(
        pageIndex,
        pageSize,
        name || "",
        className || "",
        sort || [],
        studentCode || "",
        departmentName || ""
      ),
  });
}
