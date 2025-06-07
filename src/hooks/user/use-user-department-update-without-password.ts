import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUserDepartmentUpdateWithoutPassword() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["user-department-update-without-password"],
    mutationFn: (variables: { id: number; name: string; email: string }) =>
      UserService.updateUserOfDepartmentWithoutPassword(variables),
  });
}
