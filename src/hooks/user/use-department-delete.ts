import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useDepartmentDelete() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["delete-department"],
    mutationFn: (id: string) => UserService.deleteDepartment(id),
  });
}
