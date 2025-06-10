import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesValidation() {
  const { CertificatesService } = useServices();
  return useMutation({
    mutationFn: (id: number) => CertificatesService.certificateValidation(id),
  });
}
