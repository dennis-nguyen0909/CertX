import { useQuery } from "@tanstack/react-query";
import { NotificationService } from "@/services/notifications/notifications.service";
import { NotificationStatus } from "@/models/notification";

interface UseNotificationsParams {
  page?: number;
  size?: number;
  status?: NotificationStatus;
  startDate?: string;
  endDate?: string;
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
