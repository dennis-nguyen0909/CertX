import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesReject() {
  const { CertificatesService } = useServices();
  return useMutation({
    mutationFn: (id: number) => CertificatesService.rejectCertificate(id),
  });
}
