import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useLoginForStudent() {
  const { AuthService } = useServices();

  return useMutation({
    mutationKey: ["login-for-student"],
    mutationFn: AuthService.loginForStudent,
  });
}
