import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUnlockPermissionRead() {
  const { PermissionService } = useServices();

  return useMutation({
    mutationKey: ["unlock-permission-read"],
    mutationFn: (variables: { id: number }) =>
      PermissionService.unlockPermissionRead(variables.id),
  });
}
