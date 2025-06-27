import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

export default function useVerifyPasswordUser() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["verify-password-user"],
    mutationFn: (password: string) => UserService.verifyPassword({ password }),
  });
}
