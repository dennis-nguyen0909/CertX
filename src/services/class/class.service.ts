import { ResponseType } from "@/types/response";
import { api } from "../config/axios";
import { Class } from "@/models/class";
import { PaginatedListResponse } from "@/models/common";
import { transformPaginatedList } from "@/utils/pagination";

export const ClassService = {
  findAll: async (
    pageIndex: number,
    pageSize: number,
    className?: string,
    sort?: string[]
  ) => {
    const response = await api.get<PaginatedListResponse<Class>>(
      "/v1/pdt/list-class-of-university",
      {
        params: { page: pageIndex + 1, size: pageSize, name: className, sort },
      }
    );
    return transformPaginatedList(response.data);
  },

  findByDepartment: async (
    pageIndex: number,
    pageSize: number,
    className?: string,
    sort?: string[]
  ) => {
    const response = await api.get<PaginatedListResponse<Class>>(
      "/v1/khoa/list-class-of-department",
      {
        params: { page: pageIndex + 1, size: pageSize, className, sort },
      }
    );
    return transformPaginatedList(response.data);
  },

  findByDepartmentId: async (
    departmentId: number,
    pageIndex: number,
    pageSize: number,
    className?: string,
    sort?: string[]
  ) => {
    const response = await api.get<PaginatedListResponse<Class>>(
      `/v1/admin/list-class-of-department/${departmentId}`,
      {
        params: { page: pageIndex + 1, size: pageSize, className, sort },
      }
    );
    return transformPaginatedList(response.data);
  },
  create: async (data: { id: string; className: string }) => {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    formData.append("name", data.className);

    const response = await api.post<ResponseType<Class>>(
      "/v1/pdt/create-class",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  update: async (id: number, className: string) => {
    const formData = new FormData();
    formData.append("className", className);

    const response = await api.put<ResponseType<Class>>(
      `/v1/pdt/update-class/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  },

  getById: async (id: number) => {
    const response = await api.get<Class>(`/v1/pdt/class-detail/${id}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ResponseType<Class>>(
      `/v1/pdt/delete-class/${id}`
    );
    return response.data;
  },
};
