import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useDegreeValidation() {
  const { DegreeService } = useServices();

  return useMutation({
    mutationKey: ["degree-validation"],
    mutationFn: (id: number) => DegreeService.validateDegree(id),
  });
}
