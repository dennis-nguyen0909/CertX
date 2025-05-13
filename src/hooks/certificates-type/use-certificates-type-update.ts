import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesTypeUpdate() {
  const { CertificatesTypeService } = useServices();

  return useMutation({
    mutationKey: ["certificates-type-update"],
    mutationFn: (variables: { id: number; name: string }) =>
      CertificatesTypeService.update(variables.id, variables.name),
  });
}
