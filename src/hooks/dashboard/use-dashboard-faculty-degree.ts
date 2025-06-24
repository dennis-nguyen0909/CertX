import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useFacultyDegreeStatisticsPdt = (role: string) => {
  return useQuery({
    queryKey: ["faculty-degree-statistics-pdt", role],
    queryFn: () => DashboardService.facultyDegreeStatisticsPdt(role),
  });
};
