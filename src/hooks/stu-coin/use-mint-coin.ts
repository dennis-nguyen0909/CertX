import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

interface MintParams {
  amount: number;
}

export function useMintCoin() {
  const { STUCoinService } = useServices();

  return useMutation({
    mutationFn: async ({ amount }: MintParams) => {
      return await STUCoinService.mintToken(amount);
    },
  });
}
