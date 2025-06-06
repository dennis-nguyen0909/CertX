import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUserDetail() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["user-detail"],
    mutationFn: UserService.getUserDetailById,
  });
}
