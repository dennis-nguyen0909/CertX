import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useDashboardStatistics = (role: string) => {
  return useQuery({
    queryKey: ["dashboard-statistics", role],
    queryFn: () => DashboardService.statistics(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
