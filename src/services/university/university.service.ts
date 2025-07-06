import { PaginatedListResponse } from "@/models/common";
import { api } from "../config/axios";
import { University } from "@/models/university";
import { UserOfDepartment } from "@/models/user";

export interface UniversityListParams {
  page?: number;
  size?: number;
  nameUniversity?: string;
}

export interface DepartmentListParams {
  page?: number;
  size?: number;
  name?: string;
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
  listDepartmentOfUniversity: async (
    universityId: number,
    params?: DepartmentListParams
  ) => {
    const response = await api.get<PaginatedListResponse<UserOfDepartment>>(
      `/v1/admin/list-department-of-university/${universityId}`,
      { params }
    );
    return response.data;
  },
};
