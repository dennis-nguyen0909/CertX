import { api } from "../config/axios";
import { User, UserDepartment, UserOfDepartment } from "@/models/user";
import { PaginatedListResponse } from "@/models/common";
import { transformPaginatedList } from "@/utils/pagination";
import { Student } from "@/models/student";

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
  updateUserOfDepartmentWithoutPassword: async (data: {
    id: number;
    name: string;
    email: string;
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
    passwordUniversity: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.put<unknown>(
      `v1/pdt/change-password-of-department/${data.id}`,
      {
        passwordUniversity: data.passwordUniversity,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }
    );
    return response;
  },
  changePasswordPdt: async (data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await api.put<unknown>(`v1/pdt/change-password`, data, {});
    return response;
  },
  deleteDepartment: async (id: string) => {
    const response = await api.delete<unknown>(
      `v1/pdt/delete-department/${id}`,
      {}
    );
    return response;
  },
  updateDepartment: async (data: {
    id: number;
    name: string;
    email: string;
  }) => {
    const response = await api.put<unknown>(
      `v1/pdt/update-department/${data.id}`,
      {
        name: data.name,
        email: data.email,
      },
      {}
    );
    return response;
  },
  updateUniversity: async (data: {
    name: string;
    email: string;
    address: string;
    taxCode: string;
    website: string;
  }) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("taxCode", data.taxCode);
    formData.append("website", data.website);

    const response = await api.put<unknown>("v1/pdt/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  updateUniversityLogo: async (data: { logo: File }) => {
    const formData = new FormData();
    formData.append("logo", data.logo);
    const response = await api.put<unknown>(
      "v1/pdt/university/logo",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response;
  },
  updateUniversitySeal: async (data: { seal: File }) => {
    const formData = new FormData();
    formData.append("seal", data.seal);
    const response = await api.put<unknown>(
      "v1/pdt/university/seal",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response;
  },
  verifyPassword: async (data: { password: string }) => {
    const response = await api.post<{ privateKey: string }>(
      `v1/pdt/private-key`,
      data,
      {}
    );
    return response.data;
  },
  getStudentDetail: async () => {
    const response = await api.get<Student>("/v1/student/user-detail");
    return response.data;
  },
};
