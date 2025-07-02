import { useQuery } from "@tanstack/react-query";
import { CertificatesService } from "@/services/certificates/certificates.service";

export function useCertificatesStudentList(params?: {
  page?: number;
  size?: number;
  diplomaNumber?: string;
}) {
  const query = useQuery({
    queryKey: ["certificates-student-list", params],
    queryFn: () => CertificatesService.listStudentCertificates(params),
  });
  return query;
}
