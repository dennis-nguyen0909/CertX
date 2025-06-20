import { useQuery } from "@tanstack/react-query";
import { DegreeService } from "@/services/degree/degree.service";

export function useDegreeDetail(id: number) {
  return useQuery({
    queryKey: ["degree-detail", id],
    queryFn: () => DegreeService.getDegreeDetail(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
