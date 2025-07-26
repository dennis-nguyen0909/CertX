import { useMutation } from "@tanstack/react-query";
import { DegreeService } from "@/services/degree/degree.service";

export const useCreateDegreeTitle = () => {
  return useMutation({
    mutationFn: (name: string) => DegreeService.createDegreeTitle(name),
  });
};
