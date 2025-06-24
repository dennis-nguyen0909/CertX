import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useDegreeRatingStatisticsPdt = () => {
  return useQuery({
    queryKey: ["degree-rating-statistics-pdt"],
    queryFn: DashboardService.degreeRatingStatisticsPdt,
  });
};
