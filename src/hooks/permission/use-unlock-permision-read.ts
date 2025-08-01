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

export function useUnlockPermissionUpdate() {
  const { PermissionService } = useServices();

  return useMutation({
    mutationKey: ["unlock-permission-update"],
    mutationFn: (variables: { id: number }) =>
      PermissionService.unlockPermissionUpdate(variables.id),
  });
}

export function useUnlockPermissionDelete() {
  const { PermissionService } = useServices();

  return useMutation({
    mutationKey: ["unlock-permission-delete"],
    mutationFn: (variables: { id: number }) =>
      PermissionService.unlockPermissionDelete(variables.id),
  });
}
