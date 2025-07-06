import { useQuery } from "@tanstack/react-query";
import {
  UniversityService,
  DepartmentListParams,
} from "@/services/university/university.service";
import { UserOfDepartment } from "@/models/user";
import { PaginatedListResponse } from "@/models/common";

export function useUniversityDepartmentList(
  universityId: number,
  params?: DepartmentListParams
) {
  return useQuery<PaginatedListResponse<UserOfDepartment>, Error>({
    queryKey: ["university-department-list", universityId, params],
    queryFn: () =>
      UniversityService.listDepartmentOfUniversity(universityId, params),
    enabled: !!universityId,
  });
}
