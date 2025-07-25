import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useYearlyCertificateStatistics = (role: string) => {
  return useQuery({
    queryKey: ["yearly-certificate-statistics", role],
    queryFn: () => DashboardService.certificateStatisticsByYear(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useYearlyDegreeStatistics = (role: string) => {
  return useQuery({
    queryKey: ["yearly-certificate-statistics", role],
    queryFn: () => DashboardService.degreeStatisticsByYear(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
