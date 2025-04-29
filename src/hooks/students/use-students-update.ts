import { useServices } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateStudentParams {
  id: string;
  name: string;
  email: string;
}

export function useStudentsUpdate() {
  const queryClient = useQueryClient();
  const { StudentService } = useServices();

  return useMutation({
    mutationFn: async (params: UpdateStudentParams) => {
      await StudentService.update({
        id: params.id,
        name: params.name,
        email: params.email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
