import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useImportDepartment() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["department-excel"],
    mutationFn: (data: { file: File }) =>
      UserService.importDepartment(data.file),
  });
}
