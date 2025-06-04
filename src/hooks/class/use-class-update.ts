import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useClassUpdate() {
  const { ClassService } = useServices();

  return useMutation({
    mutationKey: ["class-update"],
    mutationFn: (variables: { id: number; className: string }) =>
      ClassService.update(variables.id, variables.className),
  });
}
