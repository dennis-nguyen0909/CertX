import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CertificateService } from "@/services/certificates";
import { CreateCertificateRequest } from "@/models/certificates";

export function useCertificatesCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCertificateRequest) =>
      CertificateService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
}
