import { useServices } from "@/services";
import { Certificate } from "@/models/certificates";
import { useQuery } from "@tanstack/react-query";

interface UseCertificatesListParams {
  pageIndex: number;
  pageSize: number;
  name?: string;
  sort?: string[];
}

interface CertificatesListResponse {
  items: Certificate[];
  meta: {
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    total: number;
  };
}

export function useCertificatesList(params: UseCertificatesListParams) {
  const { CertificateService } = useServices();
  return useQuery<CertificatesListResponse>({
    queryKey: ["certificates", params],
    queryFn: async () => {
      const response = await CertificateService.find({
        page: params.pageIndex + 1,
        limit: params.pageSize,
        name: params.name,
        sort: params.sort,
      });
      return response;
    },
  });
}
