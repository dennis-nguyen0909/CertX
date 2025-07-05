import { PaginatedListResponse } from "@/models/common";
import { api } from "../config/axios";
import { University } from "@/models/university";

export interface UniversityListParams {
  page?: number;
  size?: number;
  nameUniversity?: string;
}

export const UniversityService = {
  listUniversity: async (params?: UniversityListParams) => {
    const response = await api.get<PaginatedListResponse<University>>(
      "v1/admin/list-university",
      { params }
    );
    return response.data;
  },
  getUniversityDetail: async (id: number) => {
    const response = await api.get(`v1/admin/detail-university/${id}`);
    return response.data;
  },
  unlockUniversity: async (id: number) => {
    const response = await api.put(`v1/admin/unlock-university/${id}`);
    return response.data;
  },
};
