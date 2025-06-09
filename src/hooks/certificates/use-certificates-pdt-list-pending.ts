import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import { CertificateSearchParams } from "@/models/certificate";

export function useCertificatesPdtListPending(
  params?: CertificateSearchParams
) {
  const { CertificatesService } = useServices();

  return useQuery({
    queryKey: ["certificates-pdt-list-pending", params],
    queryFn: () => CertificatesService.listCertificatePending(params),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
