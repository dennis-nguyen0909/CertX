import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useExportCertificatesList() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-export-list"],
    mutationFn: (ids: number[]) =>
      CertificatesService.exportCertificateList(ids),
  });
}
