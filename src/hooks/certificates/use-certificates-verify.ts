import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesVerify() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-verify"],
    mutationFn: CertificatesService.verifyCertificate,
  });
}
