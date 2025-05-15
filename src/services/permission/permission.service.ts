import { ResponseMessage } from "@/types/response";
import { api } from "../config/axios";

export const PermissionService = {
  unlockPermissionWrite: async (id: number) => {
    const response = await api.put<unknown>(
      `v1/pdt/unlock-permission-write/${id}`,
      {}
    );
    return response;
  },
  unlockPermissionRead: async (id: number) => {
    const response = await api.put<ResponseMessage>(
      `v1/pdt/unlock-permission-read/${id}`,
      {}
    );
    return response;
  },
  openLockDepartment: async (id: number) => {
    const response = await api.put<unknown>(
      `v1/pdt/open-lock-department/${id}`,
      {}
    );
    return response;
  },
};
