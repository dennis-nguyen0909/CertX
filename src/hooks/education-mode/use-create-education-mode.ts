import { useMutation } from "@tanstack/react-query";
import { educationModeService } from "@/services/education-mode/education-mode.service";

export const useCreateEducationMode = () => {
  return useMutation({
    mutationFn: (name: string) =>
      educationModeService.createEducationMode(name),
  });
};
