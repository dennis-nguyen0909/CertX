import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesExcel() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-excel"],
    mutationFn: (data: { file: File; certificateTypeId: string }) =>
      CertificatesService.createCertificateFromExcel(
        data.file,
        data.certificateTypeId
      ),
  });
}
