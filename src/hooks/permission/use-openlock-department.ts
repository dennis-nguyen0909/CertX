import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useOpenLockDepartment() {
  const { PermissionService } = useServices();

  return useMutation({
    mutationKey: ["open-lock-department"],
    mutationFn: (variables: { id: number }) =>
      PermissionService.openLockDepartment(variables.id),
  });
}
