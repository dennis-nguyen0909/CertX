import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUpdateUniversitySeal() {
  const { UserService } = useServices();
  return useMutation({
    mutationKey: ["update-university-seal"],
    mutationFn: (variables: { seal: File }) =>
      UserService.updateUniversitySeal(variables),
  });
}
