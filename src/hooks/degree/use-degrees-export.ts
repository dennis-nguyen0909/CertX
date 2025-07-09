import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

export function useExportDegrees() {
  const { DegreeService } = useServices();
  return useMutation({
    mutationKey: ["degree-export-excel"],
    mutationFn: async () => {
      // Assuming DegreeService.exportDegreesToExcel exists and returns a Promise
      return await DegreeService.exportExcelDegree();
    },
  });
}
