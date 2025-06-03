import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useStudentDelete() {
  const { StudentService } = useServices();

  return useMutation({
    mutationKey: ["student-delete"],
    mutationFn: (id: string) => StudentService.delete(id),
  });
}
