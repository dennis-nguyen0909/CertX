import { useMutation } from "@tanstack/react-query";
import { DegreeService } from "@/services/degree/degree.service";
import { UpdateDegreeTitleRequest } from "@/services/degree/degree.service";

export const useUpdateDegreeTitle = () => {
  return useMutation({
    mutationFn: ({ id, name }: UpdateDegreeTitleRequest) =>
      DegreeService.updateDegreeTitle(id, name),
  });
};
