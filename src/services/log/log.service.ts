import { PaginatedListResponse } from "@/models/common";
import { api } from "../config/axios";
import { Log } from "@/models/log";

export const LogService = {
  async getListLog(
    page = 1,
    size = 10,
    role: string,
    actionType?: string,
    startDate?: string,
    endDate?: string
  ) {
    const response = await api.get<PaginatedListResponse<Log>>(
      `v1/${role.toLocaleLowerCase()}/log`,
      {
        params: {
          page,
          size,
          ...(actionType ? { actionType } : {}),
          ...(startDate ? { startDate } : {}),
          ...(endDate ? { endDate } : {}),
        },
      }
    );
    return response.data;
  },

  async getDepartmentLog(page = 1, size = 10) {
    const response = await api.get<PaginatedListResponse<Log[]>>(
      "v1/pdt/log/department",
      { params: { page, size } }
    );
    return response.data;
  },

  async getLogById(id: string) {
    const response = await api.get<Log>(`v1/log/${id}`);
    return response.data;
  },

  async getKhoaLog(page = 1, size = 10) {
    const response = await api.get<PaginatedListResponse<Log[]>>(
      "v1/khoa/log",
      { params: { page, size } }
    );
    return response.data;
  },
};
