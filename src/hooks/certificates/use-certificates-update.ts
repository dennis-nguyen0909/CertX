import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";
import { CertificateUpdateRequest } from "@/models/certificate";

export function useCertificatesUpdate() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-update"],
    mutationFn: (variables: { id: number; data: CertificateUpdateRequest }) =>
      CertificatesService.updateCertificate(variables.id, variables.data),
  });
}
