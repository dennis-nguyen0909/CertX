import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useYearlyCertificateStatistics = (role: string) => {
  return useQuery({
    queryKey: ["yearly-certificate-statistics", role],
    queryFn: () => DashboardService.certificateStatisticsByYear(role),
  });
};
