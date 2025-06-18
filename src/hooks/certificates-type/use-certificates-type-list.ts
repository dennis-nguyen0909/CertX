import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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

export function useInfiniteCertificatesTypeList({
  role,
  pageSize = 10,
  name,
  sort,
}: {
  role: string;
  pageSize?: number;
  name?: string;
  sort?: string[];
}) {
  const { CertificatesTypeService } = useServices();

  return useInfiniteQuery({
    queryKey: ["infinite-certificates-type-list", role, pageSize, name, sort],
    queryFn: ({ pageParam = 1 }) =>
      CertificatesTypeService.findAll(
        role,
        pageParam - 1,
        pageSize,
        name || "",
        sort || []
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.meta.current_page < lastPage.meta.total_pages
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}
