import { api } from "../config/axios";

export interface DashboardPdtResponse {
  classCount: number;
  degreePending: number;
  degreeApproved: number;
  degreeRejected: number;
  studentCount: number;
  certificatePending: number;
  certificateApproved: number;
  certificateRejected: number;
  departmentCount: number;
}

export const DashboardService = {
  dashboardPdt: async () => {
    const response = await api.get<DashboardPdtResponse>(`v1/pdt/dashboard`);
    return response.data;
  },
};
