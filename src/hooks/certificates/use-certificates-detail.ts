import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import type { UseQueryOptions } from "@tanstack/react-query";
import { Certificate } from "@/models/certificate";

export function useCertificatesDetail(
  id: number | undefined,
  options?: Omit<UseQueryOptions<Certificate>, "queryKey" | "queryFn">
) {
  const { CertificatesService } = useServices();

  return useQuery({
    queryKey: ["certificates-detail", id],
    queryFn: () => CertificatesService.getCertificateDetail(id as number),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
}
