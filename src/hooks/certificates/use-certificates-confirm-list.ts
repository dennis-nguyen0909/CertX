import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesConfirmList() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-confirm-list"],
    mutationFn: CertificatesService.confirmCertificateByIds,
  });
}
