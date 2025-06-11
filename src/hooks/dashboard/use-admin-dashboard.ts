import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useAdminDashboard() {
  const { DashboardService } = useServices();

  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => DashboardService.getAdminDashboard(),
  });
}
