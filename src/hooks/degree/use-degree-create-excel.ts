import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useDegreeCreateExcel() {
  const { DegreeService } = useServices();

  return useMutation({
    mutationKey: ["degree-create-excel"],
    mutationFn: DegreeService.createDegreeFromExcel,
  });
}
