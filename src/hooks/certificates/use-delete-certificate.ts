import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

export const useDeleteCertificate = () => {
  const { CertificatesService } = useServices();
  // Use useMutation for delete operation instead of useQuery
  return useMutation({
    mutationKey: ["certificate-delete"],
    mutationFn: (id: number) => CertificatesService.deleteCertificate(id),
  });
};
