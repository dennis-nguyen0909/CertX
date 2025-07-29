import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useDegreeReject() {
  const { DegreeService } = useServices();
  return useMutation({
    mutationFn: ({ id, note }: { id: number; note: string }) =>
      DegreeService.rejectDegree(id, note),
  });
}
