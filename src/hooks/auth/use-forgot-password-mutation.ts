import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useForgotPasswordMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: AuthService.forgotPassword,
  });
}

export function useForgotPasswordStudentMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["forgot-password-student"],
    mutationFn: AuthService.forgotPasswordStudent,
  });
}

export function useVerifyOtpForgotPasswordStudentMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["verify-otp-forgot-password-student"],
    mutationFn: AuthService.verifyOtpForgotPasswordStudent,
  });
}

export function useResetPasswordStudentMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["reset-password-student"],
    mutationFn: AuthService.resetPasswordStudent,
  });
}

export function useStudentChangePasswordMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["student-change-password"],
    mutationFn: AuthService.studentChangePassword,
  });
}
