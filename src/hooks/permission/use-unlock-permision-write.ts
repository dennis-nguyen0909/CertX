import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUnlockPermissionWrite() {
  const { PermissionService } = useServices();

  return useMutation({
    mutationKey: ["unlock-permission-write"],
    mutationFn: (variables: { id: number }) =>
      PermissionService.unlockPermissionWrite(variables.id),
  });
}
