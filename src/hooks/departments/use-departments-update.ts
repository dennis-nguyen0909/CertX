import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DepartmentService } from "@/services/departments/departments.service";
import { UpdateDepartmentRequest } from "@/models/departments";

export function useDepartmentsUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDepartmentRequest) =>
      DepartmentService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
