import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

export const useDeleteDegreeList = () => {
  const { DegreeService } = useServices();
  // Use useMutation for delete operation instead of useQuery
  return useMutation({
    mutationKey: ["degree-delete-list"],
    mutationFn: (ids: Array<number>) => DegreeService.deleteListDegrees(ids),
  });
};
