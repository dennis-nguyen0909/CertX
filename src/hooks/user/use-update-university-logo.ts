import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUpdateUniversityLogo() {
  const { UserService } = useServices();
  return useMutation({
    mutationKey: ["update-university-logo"],
    mutationFn: (variables: { logo: File }) =>
      UserService.updateUniversityLogo(variables),
  });
}
