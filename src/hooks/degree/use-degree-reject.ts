import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useDegreeReject() {
  const { DegreeService } = useServices();
  return useMutation({
    mutationFn: (id: number) => DegreeService.rejectDegree(id),
  });
}
