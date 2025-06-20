import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useFacultyDegreeStatisticsPdt = () => {
  return useQuery({
    queryKey: ["faculty-degree-statistics-pdt"],
    queryFn: DashboardService.facultyDegreeStatisticsPdt,
  });
};
