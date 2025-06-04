import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useClassCreate() {
  const { ClassService } = useServices();

  return useMutation({
    mutationKey: ["class-create"],
    mutationFn: ClassService.create,
  });
}
