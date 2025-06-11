import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useKhoaDashboard() {
  const { DashboardService } = useServices();

  return useQuery({
    queryKey: ["khoa-dashboard"],
    queryFn: () => DashboardService.getKhoaDashboard(),
  });
}
