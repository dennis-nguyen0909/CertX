import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useVerifyOtpForgotPasswordMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["verify-otp-forgot-password"],
    mutationFn: AuthService.verifyOtpForgotPassword,
  });
}
