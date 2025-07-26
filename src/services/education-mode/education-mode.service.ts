import { api } from "../config/axios";
import { EducationMode } from "@/models/education-mode";
import { PaginatedListResponse } from "@/models/common";

export interface EducationModeListParams {
  page?: number;
  size?: number;
}

export interface CreateEducationModeRequest {
  name: string;
}

export interface UpdateEducationModeRequest {
  id: number;
  name: string;
}

export const educationModeService = {
  // GET v1/education-mode
  getEducationModeList: async ({
    page = 1,
    size = 10,
  }: EducationModeListParams = {}): Promise<
    PaginatedListResponse<EducationMode>
  > => {
    const response = await api.get<PaginatedListResponse<EducationMode>>(
      "v1/education-mode",
      {
        params: { page, size },
      }
    );
    return response.data;
  },
  // POST /api/v1/pdt/education-mode
  createEducationMode: async (name: string) => {
    const response = await api.post("v1/pdt/education-mode", { name });
    return response.data;
  },
  // POST /api/v1/pdt/education-mode/{id}
  updateEducationMode: async (id: number, name: string) => {
    const response = await api.post(`v1/pdt/education-mode/${id}`, { name });
    return response.data;
  },
  // DELETE /api/v1/pdt/education-mode/{id}
  deleteEducationMode: async (id: number) => {
    const response = await api.delete(`v1/pdt/education-mode/${id}`);
    return response.data;
  },
};
