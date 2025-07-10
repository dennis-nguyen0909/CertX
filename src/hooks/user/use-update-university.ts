import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useUpdateUniversity() {
  const { UserService } = useServices();

  return useMutation({
    mutationKey: ["update-university"],
    mutationFn: (variables: {
      name: string;
      email: string;
      address: string;
      taxCode: string;
      website: string;
    }) => UserService.updateUniversity(variables),
  });
}
