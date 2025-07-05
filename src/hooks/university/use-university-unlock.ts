import { useMutation } from "@tanstack/react-query";
import { UniversityService } from "@/services/university/university.service";

export function useUniversityUnlock() {
  return useMutation({
    mutationFn: (id: number) => UniversityService.unlockUniversity(id),
  });
}
