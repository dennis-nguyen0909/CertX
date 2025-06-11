import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";
import { Class } from "@/models/class";

export function useClassDetailByName() {
  const { ClassService } = useServices();

  return useMutation({
    mutationKey: ["class-detail-by-name"],
    mutationFn: async (name: string): Promise<Class | null> => {
      const result = await ClassService.findAll(0, 1, name);
      if (result.items && result.items.length > 0) {
        return result.items[0];
      }
      return null;
    },
  });
}
