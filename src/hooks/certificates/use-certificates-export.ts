import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";
import { ExportTypeCertificate } from "@/models/certificate";

export function useExportCertificates() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-export"],
    mutationFn: (type: ExportTypeCertificate) =>
      CertificatesService.exportCertificates(type),
  });
}
