import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useChangePasswordDepartment() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["change-password-department"],
    mutationFn: (variables: { id: number; newPassword: string }) =>
      UserService.changePasswordDepartment(variables),
  });
}
