import { useInfiniteQuery } from "@tanstack/react-query";
import {
  RatingService,
  RatingListParams,
} from "@/services/rating/rating.service";
import { PaginatedListResponse } from "@/models/common";
import { Rating } from "@/models/rating";

export const useInfiniteRatingList = (
  params?: Omit<RatingListParams, "page">
) => {
  return useInfiniteQuery<PaginatedListResponse<Rating>>({
    queryKey: ["rating-list", params],
    queryFn: ({ pageParam = 1 }) =>
      RatingService.getRatingList({
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
