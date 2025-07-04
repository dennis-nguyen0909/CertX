import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useChangePasswordPdt() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["change-password-pdt"],
    mutationFn: (variables: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => UserService.changePasswordPdt(variables),
  });
}
