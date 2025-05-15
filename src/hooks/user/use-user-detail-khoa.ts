import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUserDetailKhoa() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["user-detail-khoa"],
    mutationFn: UserService.getUserDepartmentById,
  });
}
