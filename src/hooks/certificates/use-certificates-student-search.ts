import { useMutation } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesStudentSearch() {
  const { CertificatesService } = useServices();

  return useMutation({
    mutationKey: ["certificates-student-search"],
    mutationFn: CertificatesService.searchStudents,
  });
}
