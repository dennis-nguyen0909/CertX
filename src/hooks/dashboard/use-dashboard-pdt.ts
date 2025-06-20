import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useDashboardPdt = () => {
  return useQuery({
    queryKey: ["dashboard-pdt"],
    queryFn: DashboardService.dashboardPdt,
  });
};
