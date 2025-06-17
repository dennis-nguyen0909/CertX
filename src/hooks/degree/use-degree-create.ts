import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";
import { CreateDegreeRequest } from "@/services/degree/degree.service";

export function useDegreeCreate() {
  const { DegreeService } = useServices();

  return useMutation<unknown, Error, CreateDegreeRequest>({
    mutationKey: ["degree-create"],
    mutationFn: DegreeService.createDegree,
  });
}
