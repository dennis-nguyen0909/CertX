import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useForgotPasswordMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: AuthService.forgotPassword,
  });
}
