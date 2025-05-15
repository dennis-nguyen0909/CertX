import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUserDepartmentUpdate() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["user-department-update"],
    mutationFn: (variables: {
      id: number;
      name: string;
      email: string;
      password: string;
    }) => UserService.updateUserOfDepartment(variables),
  });
}
