import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

export const useCertificatesDecrypt = (
  transactionHash: string,
  publicKeyBase64: string
) => {
  const { CertificatesService } = useServices();
  return useMutation({
    mutationFn: () =>
      CertificatesService.decryptCertificate(transactionHash, publicKeyBase64),
  });
};
