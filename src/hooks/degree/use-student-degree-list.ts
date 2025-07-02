import { useQuery } from "@tanstack/react-query";
import { DegreeService } from "@/services/degree/degree.service";

export function useStudentDegreeList(params?: {
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ["student-degree-list", params],
    queryFn: () => DegreeService.listStudentDegrees(params),
  });
}
