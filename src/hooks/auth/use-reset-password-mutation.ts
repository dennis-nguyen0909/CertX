import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useResetPasswordMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: AuthService.resetPassword,
  });
}
