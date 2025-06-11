import { api } from "../config/axios";
import { DashboardResponse } from "@/models/dashboard";

export const DashboardService = {
  // PDT Dashboard
  getPdtDashboard: async () => {
    const response = await api.get<DashboardResponse>("/v1/pdt/dashboard");
    return response.data;
  },

  // Khoa Dashboard
  getKhoaDashboard: async () => {
    const response = await api.get<DashboardResponse>("/v1/khoa/dashboard");
    return response.data;
  },

  // Admin Dashboard
  getAdminDashboard: async () => {
    const response = await api.get<DashboardResponse>("/v1/admin/dashboard");
    return response.data;
  },
};
