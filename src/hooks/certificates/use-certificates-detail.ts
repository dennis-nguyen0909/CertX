import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesDetail() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-detail"],
    mutationFn: CertificatesService.getCertificateDetail,
  });
}
