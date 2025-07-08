import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useExportCertificates() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-export"],
    mutationFn: () => CertificatesService.exportCertificates(),
  });
}
