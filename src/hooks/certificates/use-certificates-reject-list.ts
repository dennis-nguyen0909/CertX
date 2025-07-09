import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesRejectList() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-reject-list"],
    mutationFn: CertificatesService.rejectListCertificates,
  });
}
