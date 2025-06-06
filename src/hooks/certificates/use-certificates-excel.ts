import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesExcel() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-excel"],
    mutationFn: CertificatesService.createCertificateFromExcel,
  });
}
