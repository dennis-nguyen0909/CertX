import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUserDepartmentDetail() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["user-department-detail"],
    mutationFn: UserService.getUserOfDepartmentById,
  });
}
