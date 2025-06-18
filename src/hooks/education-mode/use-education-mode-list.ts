import { useInfiniteQuery } from "@tanstack/react-query";
import {
  educationModeService,
  EducationModeListParams,
} from "@/services/education-mode/education-mode.service";
import { PaginatedListResponse } from "@/models/common";
import { EducationMode } from "@/models/education-mode";

export const useInfiniteEducationModeList = (
  params?: Omit<EducationModeListParams, "page">
) => {
  return useInfiniteQuery<PaginatedListResponse<EducationMode>>({
    queryKey: ["education-mode-list", params],
    queryFn: ({ pageParam = 1 }) =>
      educationModeService.getEducationModeList({
        ...(params || {}),
        page: Number(pageParam),
      }),
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage;
      if (meta && meta.current_page < meta.total_pages) {
        return meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
