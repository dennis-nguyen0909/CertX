import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CertificateService } from "@/services/certificates";
import { UpdateCertificateRequest } from "@/models/certificates";

export function useCertificatesUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCertificateRequest) =>
      CertificateService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
}
