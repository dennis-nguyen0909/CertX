import { useMutation } from "@tanstack/react-query";
import { DegreeService } from "@/services/degree/degree.service";

export const useDeleteDegreeTitle = () => {
  return useMutation({
    mutationFn: (id: number) => DegreeService.deleteDegreeTitle(id),
  });
};
