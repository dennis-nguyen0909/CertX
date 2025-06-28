import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useResendEmailOtp() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["resend-otp-email"],
    mutationFn: AuthService.resendOtp,
  });
}
