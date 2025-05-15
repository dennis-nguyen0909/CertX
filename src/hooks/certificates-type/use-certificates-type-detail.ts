import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesTypeDetail() {
  const { CertificatesTypeService } = useServices();

  return useMutation({
    mutationKey: ["certificates-type-detail"],
    mutationFn: CertificatesTypeService.getById,
  });
}
