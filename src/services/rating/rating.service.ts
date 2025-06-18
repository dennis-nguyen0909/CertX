import { api } from "../config/axios";
import { Rating } from "../../models/rating";
import { PaginatedListResponse } from "@/models/common";

export interface RatingListParams {
  page?: number;
  size?: number;
}

export const RatingService = {
  // GET v1/khoa/rating
  getRatingList: async ({
    page = 1,
    size = 10,
  }: RatingListParams = {}): Promise<PaginatedListResponse<Rating>> => {
    const response = await api.get<PaginatedListResponse<Rating>>(
      "v1/khoa/rating",
      {
        params: { page, size },
      }
    );
    return response.data;
  },
};
