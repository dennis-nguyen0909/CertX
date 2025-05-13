import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesTypeCreate() {
  const { CertificatesTypeService } = useServices();

  return useMutation({
    mutationKey: ["certificates-type-create"],
    mutationFn: CertificatesTypeService.create,
  });
}
