import { api } from "../config/axios";
import { Rating } from "../../models/rating";
import { PaginatedListResponse } from "@/models/common";

export interface RatingListParams {
  page?: number;
  size?: number;
}

export const RatingService = {
  getRatingList: async ({
    page = 1,
    size = 10,
  }: RatingListParams = {}): Promise<PaginatedListResponse<Rating>> => {
    const response = await api.get<PaginatedListResponse<Rating>>("v1/rating", {
      params: { page, size },
    });
    return response.data;
  },
  createRating: async (name: string) => {
    const response = await api.post("v1/pdt/rating", {
      name,
    });
    return response.data;
  },
  updateRating: async (id: number, name: string) => {
    const response = await api.post(`v1/pdt/rating/${id}`, {
      name,
    });
    return response.data;
  },
  deleteRating: async (id: number) => {
    const response = await api.delete(`v1/pdt/rating/${id}`);
    return response.data;
  },
};
