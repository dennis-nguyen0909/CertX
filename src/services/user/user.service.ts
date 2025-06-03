import { api } from "../config/axios";
import { User, UserDepartment, UserOfDepartment } from "@/models/user";
import { PaginatedListResponse } from "@/models/common";
import { transformPaginatedList } from "@/utils/pagination";

export const UserService = {
  getUserOfDepartment: async (
    pageIndex: number,
    pageSize: number,
    name: string,
    sort: string[]
  ) => {
    const response = await api.get<PaginatedListResponse<UserOfDepartment>>(
      "v1/pdt/list-department-of-university",
      {
        params: {
          page: pageIndex + 1,
          size: pageSize,
          name,
          sort,
        },
      }
    );
    return transformPaginatedList(response.data);
  },
  createUserOfDepartment: async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post<unknown>("v1/pdt/create-user", data, {});
    return response;
  },
  updateUserOfDepartment: async (data: {
    id: number;
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await api.put<unknown>(`v1/pdt/user/${data.id}`, data, {});
    return response;
  },
  deleteUserOfDepartment: async (id: number) => {
    const response = await api.delete<unknown>(`v1/pdt/user/${id}`, {});
    return response;
  },
  getUserOfDepartmentById: async (id: number) => {
    const response = await api.get<UserOfDepartment>(`v1/pdt/user/${id}`, {});
    return response;
  },
  getUserDetailById: async () => {
    const response = await api.get<User>(`v1/pdt/user-detail`, {});
    return response;
  },
  getUserDepartmentById: async () => {
    const response = await api.get<UserDepartment>(`v1/khoa/user-detail`, {});
    return response;
  },
  changePasswordDepartment: async (data: {
    id: number;
    newPassword: string;
  }) => {
    const response = await api.put<unknown>(
      `v1/pdt/change-password-of-department`,
      data,
      {}
    );
    return response;
  },
  changePasswordUser: async (data: { id: number; newPassword: string }) => {
    const response = await api.put<unknown>(`v1/pdt/change-password`, data, {});
    return response;
  },
};
