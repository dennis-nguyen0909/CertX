import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DepartmentService } from "@/services/departments/departments.service";

export function useDepartmentsDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DepartmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
