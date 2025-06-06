import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesCreate() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-create"],
    mutationFn: CertificatesService.createCertificate,
  });
}
