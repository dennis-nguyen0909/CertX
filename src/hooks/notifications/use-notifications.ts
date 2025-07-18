import { useQuery } from "@tanstack/react-query";
import { NotificationService } from "@/services/notifications/notifications.service";
import { NotificationStatus } from "@/models/notification";

export interface UseNotificationsParams {
  page?: number;
  size?: number;
  status?: NotificationStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export const useNotifications = (params: UseNotificationsParams = {}) => {
  return useQuery({
    queryKey: [
      "notifications",
      params.page,
      params.size,
      params.status,
      params.startDate,
      params.endDate,
    ],
    queryFn: () => NotificationService.getNotifications(params),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
};

export const useAllNotifications = (
  params: Omit<UseNotificationsParams, "status"> = {}
) => {
  return useQuery({
    queryKey: [
      "allNotificationsMeta",
      params.page,
      params.size,
      params.startDate,
      params.endDate,
      params.search,
    ],
    queryFn: () =>
      NotificationService.getNotifications({ ...params, status: "all" }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
};

export const useUnreadNotifications = (
  params: Omit<UseNotificationsParams, "status"> = {}
) => {
  return useQuery({
    queryKey: [
      "unreadNotificationsMeta",
      params.page,
      params.size,
      params.startDate,
      params.endDate,
      params.search,
    ],
    queryFn: () =>
      NotificationService.getNotifications({ ...params, status: "unread" }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
};

export const useNotificationDetail = ({
  notificationId,
  documentType,
  documentId,
}: {
  notificationId: number;
  documentType: string;
  documentId: number;
}) => {
  return useQuery({
    queryKey: [
      "notifications-detail",
      notificationId,
      documentType,
      documentId,
    ],
    queryFn: () =>
      NotificationService.getNotificationDetail({
        notificationId,
        documentType,
        documentId,
      }),
    enabled:
      notificationId !== undefined &&
      !!documentType &&
      documentId !== undefined,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
};
