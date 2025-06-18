import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { DegreeService } from "@/services/degree/degree.service";
import { PaginatedListResponse } from "@/models/common";
import { DegreeTitle } from "@/models/degree";

export const useInfiniteDegreeTitleList = (params?: { size?: number }) => {
  return useInfiniteQuery<PaginatedListResponse<DegreeTitle>>({
    queryKey: ["degree-title-list", params],
    queryFn: ({ pageParam = 1 }) =>
      DegreeService.getListDegreeTitle({
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

// Hook thường để lấy danh sách degree title (không infinite)
export const useDegreeTitleList = (params?: {
  page?: number;
  size?: number;
  name?: string;
}) => {
  return useQuery<PaginatedListResponse<DegreeTitle>>({
    queryKey: ["degree-title-list", params],
    queryFn: () => DegreeService.getListDegreeTitle(params),
    staleTime: 5 * 60 * 1000,
  });
};
