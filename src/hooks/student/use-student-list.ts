import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
  studentCode,
}: {
  pageIndex: number;
  pageSize: number;
  name?: string;
  className?: string;
  departmentName?: string;
  sort?: string[];
  studentCode?: string;
}) {
  const { StudentService } = useServices();
  const role = useSelector((state: RootState) => state.user.role);
  return useQuery({
    queryKey: [
      "student-list",
      pageIndex,
      pageSize,
      name,
      className,
      departmentName,
      sort,
      studentCode,
    ],
    queryFn: () => {
      if (role === "PDT") {
        return StudentService.getStudentsOfUniversity(
          pageIndex,
          pageSize,
          name,
          className,
          departmentName,
          sort || [],
          studentCode
        );
      }
      if (role === "KHOA") {
        return StudentService.getStudentsList(
          pageIndex,
          pageSize,
          name,
          className,
          sort || [],
          studentCode
        );
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}

export function useInfiniteStudentList({
  pageSize = 10,
  name,
  className,
  departmentName,
  sort,
  studentCode,
}: {
  pageSize?: number;
  name?: string;
  className?: string;
  departmentName?: string;
  sort?: string[];
  studentCode?: string;
}) {
  const { StudentService } = useServices();
  const role = useSelector((state: RootState) => state.user.role);

  return useInfiniteQuery({
    queryKey: [
      "infinite-student-list",
      pageSize,
      name,
      className,
      departmentName,
      sort,
      studentCode,
    ],
    queryFn: ({ pageParam = 1 }) => {
      if (role === "PDT") {
        return StudentService.getStudentsOfUniversity(
          pageParam - 1,
          pageSize,
          name,
          className,
          departmentName,
          sort || [],
          studentCode
        );
      }
      if (role === "KHOA") {
        return StudentService.getStudentsList(
          pageParam - 1,
          pageSize,
          name,
          className,
          sort || [],
          studentCode
        );
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.meta.current_page < lastPage.meta.total_pages
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}
