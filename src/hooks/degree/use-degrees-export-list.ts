import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

type ExportDegreesListParams = {
  ids: number[];
};

export function useExportDegreesList() {
  const { DegreeService } = useServices();
  return useMutation({
    mutationKey: ["degree-export-excel-list"],
    mutationFn: async ({ ids }: ExportDegreesListParams) => {
      // Assuming DegreeService.exportDegreeList exists and returns a Promise
      return await DegreeService.exportDegreeList(ids);
    },
  });
}
