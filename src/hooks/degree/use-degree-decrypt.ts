import { useMutation } from "@tanstack/react-query";
import { DegreeService } from "@/services/degree/degree.service";

export function useDegreeDecrypt(
  transactionHash: string,
  publicKeyBase64: string
) {
  return useMutation({
    mutationFn: () =>
      DegreeService.decryptDegree(transactionHash, publicKeyBase64),
  });
}
