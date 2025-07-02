import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/user/user.service";

export function useStudentDetail() {
  return useQuery({
    queryKey: ["student-detail"],
    queryFn: () => UserService.getStudentDetail(),
  });
}
