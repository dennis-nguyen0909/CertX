import { useQuery } from "@tanstack/react-query";
import { ClassService } from "@/services/class/class.service";
import { Class } from "@/models/class";
import { PaginatedListResponse } from "@/models/common";

export function useClassListByUniversityAdmin(
  universityId: number,
  pageIndex: number,
  pageSize: number,
  className?: string
) {
  return useQuery<PaginatedListResponse<Class>, Error>({
    queryKey: [
      "class-list-by-university-admin",
      universityId,
      pageIndex,
      pageSize,
      className,
    ],
    queryFn: () =>
      ClassService.findByUniversityId(
        universityId,
        pageIndex,
        pageSize,
        className
      ),
    enabled: !!universityId,
  });
}
