import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useCertificatesTypeList({
  pageIndex,
  pageSize,
  name,
  sort,
}: {
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
        pageIndex,
        pageSize,
        name || "",
        sort || []
      ),
  });
}
