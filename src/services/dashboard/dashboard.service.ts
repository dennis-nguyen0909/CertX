import {
  DashboardPdtResponse,
  FacultyDegreeStatisticsResponse,
} from "@/models/dashboard";
import { api } from "../config/axios";

export const DashboardService = {
  dashboardPdt: async () => {
    const response = await api.get<DashboardPdtResponse>(`v1/pdt/dashboard`);
    return response.data;
  },
  facultyDegreeStatisticsPdt: async () => {
    const response = await api.get<FacultyDegreeStatisticsResponse[]>(
      `v1/pdt/faculty-degree-statistics`
    );
    return response.data;
  },
};
