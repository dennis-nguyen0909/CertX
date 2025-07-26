import { useMutation } from "@tanstack/react-query";
import { educationModeService } from "@/services/education-mode/education-mode.service";

export const useDeleteEducationMode = () => {
  return useMutation({
    mutationFn: (id: number) => educationModeService.deleteEducationMode(id),
  });
};
