import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function usePdtDashboard() {
  const { DashboardService } = useServices();

  return useQuery({
    queryKey: ["pdt-dashboard"],
    queryFn: () => DashboardService.getPdtDashboard(),
  });
}
