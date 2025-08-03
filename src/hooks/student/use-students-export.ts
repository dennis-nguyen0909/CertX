import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

export function useExportStudents() {
  const { StudentService } = useServices();

  return useMutation({
    mutationFn: async (ids: (number | string)[]) => {
      // Convert string IDs to numbers if needed
      const numericIds = ids.map((id) =>
        typeof id === "string" ? Number(id) : id
      );
      return StudentService.exportStudentList(numericIds);
    },
  });
}
