import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import { CertificateSearchParams } from "@/models/certificate";

interface UseCertificatesListParams extends CertificateSearchParams {
  role: string;
  view?: "main" | "pending";
}

export function useCertificatesList(params?: UseCertificatesListParams) {
  const { CertificatesService } = useServices();

  const { role, view, ...searchParams } = params || {};

  // Determine which service method to call based on view
  const queryKey =
    view === "pending" && role === "PDT"
      ? ["certificates-pending-list", params]
      : ["certificates-list", params];

  const queryFn = () => {
    if (view === "pending" && role === "PDT") {
      return CertificatesService.listCertificatesPending(searchParams);
    }
    return CertificatesService.listCertificates(role || "KHOA", searchParams);
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!role && !!params,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
