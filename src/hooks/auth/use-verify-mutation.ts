import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useVerifyMutation() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["verify"],
    mutationFn: AuthService.verify,
  });
}
