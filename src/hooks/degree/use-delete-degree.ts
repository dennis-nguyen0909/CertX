import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

export const useDeleteDegree = () => {
  const { DegreeService } = useServices();
  // Use useMutation for delete operation instead of useQuery
  return useMutation({
    mutationKey: ["degree-delete"],
    mutationFn: (id: number) => DegreeService.deleteDegree(id),
  });
};
