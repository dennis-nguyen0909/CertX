import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard/dashboard.service";

export const useCountCertificateType = (role: string) => {
  return useQuery({
    queryKey: ["count-certificate-type", role],
    queryFn: () => DashboardService.countCertificateType(role),
  });
};
