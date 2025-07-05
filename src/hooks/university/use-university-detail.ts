import { useQuery } from "@tanstack/react-query";
import { UniversityService } from "@/services/university/university.service";

export function useUniversityDetail(id?: number) {
  return useQuery({
    queryKey: ["university-detail", id],
    queryFn: () =>
      id
        ? UniversityService.getUniversityDetail(id)
        : Promise.resolve(undefined),
    enabled: !!id,
  });
}
