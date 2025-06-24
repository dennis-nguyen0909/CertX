import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useDegreeRatingStatisticsPdt = (role: string) => {
  return useQuery({
    queryKey: ["degree-rating-statistics-pdt", role],
    queryFn: () => DashboardService.degreeRatingStatisticsPdt(role),
  });
};
