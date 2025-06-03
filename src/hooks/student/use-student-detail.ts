import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useStudentDetail() {
  const { StudentService } = useServices();

  return useMutation({
    mutationKey: ["student-detail"],
    mutationFn: StudentService.getById,
  });
}
