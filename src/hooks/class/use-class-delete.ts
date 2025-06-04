import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useClassDelete() {
  const { ClassService } = useServices();

  return useMutation({
    mutationKey: ["class-delete"],
    mutationFn: (id: string) => ClassService.delete(id),
  });
}
