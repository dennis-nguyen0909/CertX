import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useImportClassOfDepartment() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["class-excel"],
    mutationFn: (data: { file: File; departmentId: string }) =>
      UserService.importClassOfDepartment(data.file, data.departmentId),
  });
}
