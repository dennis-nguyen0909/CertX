import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUserDepartmentCreate() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["user-department-create"],
    mutationFn: UserService.createUserOfDepartment,
  });
}
