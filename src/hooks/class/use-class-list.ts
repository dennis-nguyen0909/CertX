import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";

export function useClassList({
  pageIndex,
  pageSize,
  className,
  sort,
}: {
  pageIndex: number;
  pageSize: number;
  className?: string;
  sort?: string[];
}) {
  const { ClassService } = useServices();

  return useQuery({
    queryKey: ["class-list", pageIndex, pageSize, className, sort],
    queryFn: () =>
      ClassService.findAll(pageIndex, pageSize, className || "", sort || []),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
