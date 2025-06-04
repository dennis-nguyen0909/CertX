import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useClassDetail() {
  const { ClassService } = useServices();

  return useMutation({
    mutationKey: ["class-detail"],
    mutationFn: ClassService.getById,
  });
}
