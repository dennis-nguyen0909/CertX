import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

interface TransferParams {
  toAddress: string;
  amount: number;
}

export function useTransferCoinStudent() {
  const { STUCoinService } = useServices();

  return useMutation({
    mutationFn: async ({ toAddress, amount }: TransferParams) => {
      return await STUCoinService.studentTransferToken(toAddress, amount);
    },
  });
}
