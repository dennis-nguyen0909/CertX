import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesTypeDelete() {
  const { CertificatesTypeService } = useServices();

  return useMutation({
    mutationKey: ["certificates-type-delete"],
    mutationFn: (id: string) => CertificatesTypeService.delete(id),
  });
}
