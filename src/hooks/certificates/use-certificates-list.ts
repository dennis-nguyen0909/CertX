import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import { CertificateSearchParams } from "@/models/certificate";

export function useCertificatesList(params?: CertificateSearchParams) {
  const { CertificatesService } = useServices();

  return useQuery({
    queryKey: ["certificates-list", params],
    queryFn: () => CertificatesService.listCertificates(params),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
