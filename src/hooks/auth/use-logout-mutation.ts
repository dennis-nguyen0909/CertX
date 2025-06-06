import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useLogoutMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: AuthService.logout,
  });
}
