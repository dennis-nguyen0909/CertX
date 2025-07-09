import { useMutation } from "@tanstack/react-query";
import { DegreeService } from "@/services/degree/degree.service";

export function useDegreeRejectList() {
  return useMutation({
    mutationKey: ["degree-reject-list"],
    mutationFn: DegreeService.rejectDegreeList,
  });
}
