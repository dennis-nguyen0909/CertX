import { useQuery } from "@tanstack/react-query";
import {
  UniversityService,
  UniversityListParams,
} from "@/services/university/university.service";

export function useUniversityList(params?: UniversityListParams) {
  return useQuery({
    queryKey: ["university-list", params],
    queryFn: () => UniversityService.listUniversity(params),
  });
}
