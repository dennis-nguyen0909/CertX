import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useRegisterMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["register"],
    mutationFn: AuthService.register,
  });
}
