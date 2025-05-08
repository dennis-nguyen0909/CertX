import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DepartmentService } from "@/services/departments/departments.service";
import { CreateDepartmentRequest } from "@/models/departments";

export function useDepartmentsCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) =>
      DepartmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });
}
