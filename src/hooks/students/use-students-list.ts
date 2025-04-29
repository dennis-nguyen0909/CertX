import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

interface UseStudentsListParams {
  pageIndex: number;
  pageSize: number;
  name?: string;
  sort?: string[];
}

export function useStudentsList(params: UseStudentsListParams) {
  const { StudentService } = useServices();

  return useQuery({
    queryKey: ["students", params],
    queryFn: async () => {
      return await StudentService.find(params);
    },
  });
}
