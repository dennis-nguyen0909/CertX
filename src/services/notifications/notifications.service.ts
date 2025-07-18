import { PaginatedListResponse } from "@/models/common";
import api from "../config/axios";
import { Notification, NotificationStatus } from "@/models/notification";

export const NotificationService = {
  getNotifications: async ({
    page = 1,
    size = 10,
    status = "all",
    startDate,
    endDate,
    search,
  }: {
    page?: number;
    size?: number;
    status?: NotificationStatus;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => {
    const response = await api.get<PaginatedListResponse<Notification>>(
      `v1/notification`,
      {
        params: { page, size, status, startDate, endDate, search },
      }
    );
    return response.data;
  },
  getNotificationDetail: async ({
    notificationId,
    documentType,
    documentId,
  }: {
    notificationId: number;
    documentType: string;
    documentId: number;
  }) => {
    const response = await api.get(`v1/notification-detail`, {
      params: { notificationId, documentType, documentId },
    });
    return response;
  },
  markAllAsRead: async () => {
    const response = await api.post(`v1/notification/read-all`);
    return response.data;
  },
};
