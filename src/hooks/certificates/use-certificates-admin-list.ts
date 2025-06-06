import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import { CertificateSearchParams } from "@/models/certificate";

export function useCertificatesAdminList(params?: CertificateSearchParams) {
  const { CertificatesService } = useServices();

  return useQuery({
    queryKey: ["certificates-admin-list", params],
    queryFn: () => CertificatesService.listAdminCertificates(params),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
