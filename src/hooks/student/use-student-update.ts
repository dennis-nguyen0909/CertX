import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useStudentUpdate() {
  const { StudentService } = useServices();

  return useMutation({
    mutationKey: ["student-update"],
    mutationFn: (variables: {
      id: number;
      name: string;
      className: string;
      departmentName: string;
      studentCode: string;
      email: string;
      birthDate: string;
      course: string;
    }) =>
      StudentService.update(
        variables.id,
        variables.name,
        variables.className,
        variables.departmentName,
        variables.studentCode,
        variables.email,
        variables.birthDate,
        variables.course
      ),
  });
}
