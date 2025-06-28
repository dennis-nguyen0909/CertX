import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useFacultyDegreeStatisticsPdt = (role: string) => {
  return useQuery({
    queryKey: ["faculty-degree-statistics", role],
    queryFn: () => DashboardService.facultyDegreeStatisticsPdt(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
