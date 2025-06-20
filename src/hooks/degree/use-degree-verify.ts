import { useMutation } from "@tanstack/react-query";
import { DegreeService } from "@/services/degree/degree.service";

export function useDegreeVerify() {
  return useMutation({
    mutationFn: (ipfsUrl: string) => DegreeService.verifyDegree(ipfsUrl),
  });
}
