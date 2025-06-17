import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";
import { Degree } from "@/models/degree";

export function useDegreeUpdate() {
  const { DegreeService } = useServices();

  return useMutation({
    mutationKey: ["degree-update"],
    mutationFn: ({ id, data }: { id: number; data: Partial<Degree> }) =>
      DegreeService.updateDegree(id, data),
  });
}
