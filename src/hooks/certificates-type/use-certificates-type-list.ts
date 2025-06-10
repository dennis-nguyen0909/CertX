import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesTypeList({
  role,
  pageIndex,
  pageSize,
  name,
  sort,
}: {
  role: string;
  pageIndex: number;
  pageSize: number;
  name?: string;
  sort?: string[];
}) {
  const { CertificatesTypeService } = useServices();

  return useQuery({
    queryKey: ["certificates-type-list", pageIndex, pageSize, name, sort],
    queryFn: () =>
      CertificatesTypeService.findAll(
        role,
        pageIndex,
        pageSize,
        name || "",
        sort || []
      ),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
