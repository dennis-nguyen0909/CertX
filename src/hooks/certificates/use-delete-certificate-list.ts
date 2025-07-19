import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

export const useDeleteCertificateList = () => {
  const { CertificatesService } = useServices();
  // Use useMutation for delete operation instead of useQuery
  return useMutation({
    mutationKey: ["certificate-delete-list"],
    mutationFn: (ids: Array<number>) =>
      CertificatesService.deleteListCertificates(ids),
  });
};
