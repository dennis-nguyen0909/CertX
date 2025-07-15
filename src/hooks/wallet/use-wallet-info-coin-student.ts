import { useServices } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useWalletInfoCoinStudent() {
  const { WalletService } = useServices();
  return useQuery({
    queryKey: ["wallet-info-coin-student"],
    queryFn: () => WalletService.getCoinOfStudent(),
  });
}
