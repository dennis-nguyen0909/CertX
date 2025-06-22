import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import { DegreeSearchParams } from "@/services/degree/degree.service";

export function useDegreeRejectedList({
  role,
  page = 1,
  size = 10,
  departmentName,
  className,
  studentCode,
  studentName,
  graduationYear,
}: { role: string } & DegreeSearchParams) {
  const { DegreeService } = useServices();

  const queryFn = () => {
    const params: DegreeSearchParams = {
      page,
      size,
      departmentName,
      className,
      studentCode,
      studentName,
      graduationYear,
    };

    return DegreeService.getRejectedDegreeList({
      role,
      ...params,
    });
  };

  return useQuery({
    queryKey: [
      "degree-rejected-list",
      role,
      page,
      size,
      departmentName,
      className,
      studentCode,
      studentName,
      graduationYear,
    ],
    queryFn,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
