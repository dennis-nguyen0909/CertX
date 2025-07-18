import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServices } from "@/services";

export const useMarkAllNotificationsAsRead = () => {
  const { NotificationService } = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: NotificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
