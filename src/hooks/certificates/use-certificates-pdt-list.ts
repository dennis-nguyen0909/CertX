import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import { CertificateSearchParams } from "@/models/certificate";

export function useCertificatesPdtList(params?: CertificateSearchParams) {
  const { CertificatesService } = useServices();

  return useQuery({
    queryKey: ["certificates-pdt-list", params],
    queryFn: () => CertificatesService.listPdtCertificates(params),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
