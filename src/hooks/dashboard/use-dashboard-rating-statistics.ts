import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useDegreeRatingStatisticsPdt = (role: string) => {
  return useQuery({
    queryKey: ["degree-rating-statistics", role],
    queryFn: () => DashboardService.degreeRatingStatisticsPdt(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
