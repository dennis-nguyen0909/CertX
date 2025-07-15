import { useServices } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useWalletInfoCoin() {
  const { WalletService } = useServices();
  return useQuery({
    queryKey: ["wallet-info-coin"],
    queryFn: () => WalletService.getInfoCoin(),
  });
}
