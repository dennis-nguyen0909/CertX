import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useStudentCreate() {
  const { StudentService } = useServices();

  return useMutation({
    mutationKey: ["student-create"],
    mutationFn: (variables: {
      name: string;
      className: string;
      departmentName: string;
      studentCode: string;
      email: string;
      birthDate: string;
      course: string;
    }) =>
      StudentService.create(
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
