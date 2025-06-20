import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";
import { setupBearerAuthorization } from "@/services/config/axios";

export function useUserDetailKhoa() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["user-detail-khoa"],
    mutationFn: (accessToken: string) => {
      if (accessToken) {
        setupBearerAuthorization(accessToken);
      }
      return UserService.getUserDepartmentById();
    },
  });
}
