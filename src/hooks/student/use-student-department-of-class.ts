import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useStudentDepartmentOfClass() {
  const { StudentService } = useServices();

  return useMutation({
    mutationKey: ["student-department-of-class"],
    mutationFn: (className?: string) =>
      StudentService.getDepartmentOfClass(className),
  });
}
