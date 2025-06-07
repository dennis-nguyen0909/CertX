import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useStudentClassOfDepartment() {
  const { StudentService } = useServices();

  return useMutation({
    mutationKey: ["student-class-of-department"],
    mutationFn: (departmentId: string) =>
      StudentService.getClassOfDepartment(departmentId),
  });
}
