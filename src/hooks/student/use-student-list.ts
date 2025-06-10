import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
  const role = useSelector((state: RootState) => state.user.role);
  console.log("duydeptrai role", role);
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
    queryFn: () => {
      if (role === "PDT") {
        return StudentService.getStudentsOfUniversity(
          pageIndex,
          pageSize,
          name || "",
          className || "",
          departmentName || "",
          sort || []
        );
      }
      if (role === "KHOA") {
        return StudentService.getStudentsList(
          pageIndex,
          pageSize,
          name || "",
          className || "",
          sort || []
        );
      }
      return StudentService.getStudentsList(
        pageIndex,
        pageSize,
        name || "",
        className || "",
        sort || []
      );
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
