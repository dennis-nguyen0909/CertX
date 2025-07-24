import { ExportTypeCertificate } from "@/models/certificate";
import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

type ExportDegreesListParams = {
  type: ExportTypeCertificate;
  ids: number[];
};

export function useExportDegreesList() {
  const { DegreeService } = useServices();
  return useMutation({
    mutationKey: ["degree-export-excel-list"],
    mutationFn: async ({ type, ids }: ExportDegreesListParams) => {
      // Assuming DegreeService.exportDegreeList exists and returns a Promise
      return await DegreeService.exportDegreeList(type, ids);
    },
  });
}
