import { api } from "../config/axios";
import { EducationMode } from "@/models/education-mode";
import { PaginatedListResponse } from "@/models/common";

export interface EducationModeListParams {
  page?: number;
  size?: number;
}

export const educationModeService = {
  // GET v1/khoa/education-mode
  getEducationModeList: async ({
    page = 1,
    size = 10,
  }: EducationModeListParams = {}): Promise<
    PaginatedListResponse<EducationMode>
  > => {
    const response = await api.get<PaginatedListResponse<EducationMode>>(
      "v1/khoa/education-mode",
      {
        params: { page, size },
      }
    );
    return response.data;
  },
};
