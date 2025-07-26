import { useMutation } from "@tanstack/react-query";
import {
  educationModeService,
  UpdateEducationModeRequest,
} from "@/services/education-mode/education-mode.service";

export const useUpdateEducationMode = () => {
  return useMutation({
    mutationFn: ({ id, name }: UpdateEducationModeRequest) =>
      educationModeService.updateEducationMode(id, name),
  });
};
