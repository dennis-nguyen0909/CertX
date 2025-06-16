import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesDetail(id: number) {
  const { CertificatesService } = useServices();

  return useQuery({
    queryKey: ["certificates-detail", id],
    queryFn: () => CertificatesService.getCertificateDetail(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
