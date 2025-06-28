import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useMonthlyCertificateStatistics = (role: string) => {
  return useQuery({
    queryKey: ["monthly-certificate-statistics", role],
    queryFn: () => DashboardService.monthlyCertificateStatistics(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
