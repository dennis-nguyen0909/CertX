import { useServices } from "@/services";
import { useMutation } from "@tanstack/react-query";

interface ExchangeParams {
  id: number;
  amount: number;
}

export function useExchangePaymentCoin() {
  const { STUCoinService } = useServices();

  return useMutation({
    mutationFn: async ({ id, amount }: ExchangeParams) => {
      return await STUCoinService.exchangeToken(id, amount);
    },
  });
}
