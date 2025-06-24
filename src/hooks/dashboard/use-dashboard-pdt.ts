import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useDashboardPdt = (role: string) => {
  return useQuery({
    queryKey: ["dashboard-pdt", role],
    queryFn: () => DashboardService.dashboardPdt(role),
  });
};
