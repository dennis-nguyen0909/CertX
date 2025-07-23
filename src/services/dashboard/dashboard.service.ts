import {
  DashboardPdtResponse,
  FacultyDegreeStatisticsResponse,
} from "@/models/dashboard";
import { api } from "../config/axios";

type DashboardResponseCertificateType = {
  name: string;
  approved: number;
  percentage: number;
};

export const DashboardService = {
  dashboardPdt: async (role: string) => {
    const response = await api.get<DashboardPdtResponse>(
      `v1/${role.toLowerCase()}/dashboard`
    );
    return response.data;
  },
  facultyDegreeStatisticsPdt: async (role: string) => {
    const response = await api.get<FacultyDegreeStatisticsResponse[]>(
      `v1/${role.toLowerCase()}/dashboard/faculty-degree-statistics`
    );
    return response.data;
  },
  degreeRatingStatisticsPdt: async (role: string) => {
    const response = await api.get(
      `v1/${role.toLowerCase()}/dashboard/degree-rating-statistics`
    );
    return response.data;
  },
  monthlyCertificateStatistics: async (role: string) => {
    const response = await api.get(
      `v1/${role.toLocaleLowerCase()}/dashboard/monthly-certificate-statistics`
    );
    return response.data;
  },
  certificateStatisticsByYear: async (role: string) => {
    const response = await api.get(
      `v1/${role.toLocaleLowerCase()}/dashboard/certificate-statistics-by-year`
    );
    return response.data;
  },
  countCertificateType: async (role: string) => {
    const response = await api.get<DashboardResponseCertificateType[]>(
      `v1/${role.toLocaleLowerCase()}/dashboard/count-certificate-type`
    );
    return response.data;
  },
  statistics: async (role: string) => {
    const response = await api.get(`v1/${role.toLocaleLowerCase()}/statistics`);
    return response.data;
  },
};
