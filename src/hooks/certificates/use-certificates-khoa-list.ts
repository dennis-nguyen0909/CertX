import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import { CertificateSearchParams } from "@/models/certificate";

export function useCertificatesKhoaList(params?: CertificateSearchParams) {
  const { CertificatesService } = useServices();

  return useQuery({
    queryKey: ["certificates-khoa-list", params],
    queryFn: () => CertificatesService.listKhoaCertificates(params),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
