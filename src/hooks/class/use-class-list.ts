import { useQuery } from "@tanstack/react-query";
import { useServices } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";

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
  const role = useSelector((state: RootState) => state.user.role);
  const { ClassService } = useServices();

  // Debug effect to track role changes
  useEffect(() => {}, [role]);

  return useQuery({
    queryKey: ["class-list", pageIndex, pageSize, className, sort, role],
    queryFn: async () => {
      if (role === "PDT") {
        return await ClassService.findAll(
          pageIndex,
          pageSize,
          className || "",
          sort || []
        );
      } else if (role === "KHOA") {
        return await ClassService.findByDepartment(
          pageIndex,
          pageSize,
          className || ""
          // sort || []
        );
      } else {
        // Default case - use findByDepartment for other roles
        console.log("📞 Calling ClassService.findByDepartment for role:", role);
        return await ClassService.findByDepartment(
          pageIndex,
          pageSize,
          className || ""
          // sort || []
        );
      }
    },
    enabled: !!role && (role === "PDT" || role === "KHOA"), // Only run for valid roles
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
  });
}
