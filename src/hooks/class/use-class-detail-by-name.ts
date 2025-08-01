import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";
import { Class } from "@/models/class";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useClassDetailByName() {
  const { ClassService } = useServices();
  const role = useSelector((state: RootState) => state.user.role);

  return useMutation({
    mutationKey: ["class-detail-by-name", role],
    mutationFn: async (name: string): Promise<Class | null> => {
      let result;
      if (role === "KHOA") {
        result = await ClassService.findByDepartment(0, 1, name);
      } else {
        result = await ClassService.findAll(0, 1, name);
      }
      if (result.items && result.items.length > 0) {
        return result.items[0];
      }
      return null;
    },
  });
}
