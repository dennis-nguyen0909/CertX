import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesReject() {
  const { CertificatesService } = useServices();
  return useMutation({
    mutationFn: ({ id, note }: { id: number; note: string }) =>
      CertificatesService.rejectCertificate({ id, note }),
  });
}
