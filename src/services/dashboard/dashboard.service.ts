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
      `v1/pdt/dashboard/faculty-degree-statistics`
    );
    return response.data;
  },
  degreeRatingStatisticsPdt: async () => {
    const response = await api.get(`v1/pdt/dashboard/degree-rating-statistics`);
    return response.data;
  },
};
