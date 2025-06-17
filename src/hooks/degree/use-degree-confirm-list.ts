import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useDegreeConfirmList() {
  const { DegreeService } = useServices();

  return useMutation({
    mutationKey: ["degree-confirm-list"],
    mutationFn: (degreeIds: number[]) =>
      DegreeService.confirmDegreeList(degreeIds),
  });
}
