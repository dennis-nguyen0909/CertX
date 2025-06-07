import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUpdateDepartment() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["update-department"],
    mutationFn: (variables: { id: number; name: string; email: string }) =>
      UserService.updateDepartment(variables),
  });
}
