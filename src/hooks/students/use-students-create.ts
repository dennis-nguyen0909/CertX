import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServices } from "@/services";

interface CreateStudentParams {
  name: string;
  email: string;
}

export function useStudentsCreate() {
  const queryClient = useQueryClient();
  const { StudentService } = useServices();

  return useMutation({
    mutationFn: async (params: CreateStudentParams) => {
      return await StudentService.create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
