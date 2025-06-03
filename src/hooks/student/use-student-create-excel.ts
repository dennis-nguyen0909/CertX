import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useStudentCreateExcel() {
  const { StudentService } = useServices();

  return useMutation({
    mutationKey: ["student-create-excel"],
    mutationFn: (file: File) => StudentService.createFromExcel(file),
  });
}
