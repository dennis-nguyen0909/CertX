import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";
import { setupBearerAuthorization } from "@/services/config/axios";

export function useUserDetail() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["user-detail"],
    mutationFn: (accessToken: string) => {
      if (accessToken) {
        setupBearerAuthorization(accessToken);
      }
      return UserService.getUserDetailById();
    },
  });
}
