import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import { DegreeSearchParams } from "@/services/degree/degree.service";

export function useDegreePendingList({
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

    if (role === "admin") return DegreeService.getAdminDegreeList(params); // Nếu có API pending cho admin thì thay thế
    if (role === "pdt") return DegreeService.getPDTPendingDegreeList(params);
    return DegreeService.getKhoaPendingDegreeList(params);
  };

  return useQuery({
    queryKey: [
      "degree-pending-list",
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
