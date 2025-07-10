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
  }: {
    page?: number;
    size?: number;
    status?: NotificationStatus;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get<PaginatedListResponse<Notification>>(
      `v1/notification`,
      {
        params: { page, size, status, startDate, endDate },
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
};
