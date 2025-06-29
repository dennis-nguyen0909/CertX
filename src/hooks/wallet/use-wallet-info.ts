import { useQuery } from "@tanstack/react-query";
import { WalletService } from "@/services/wallet/wallet.service";

export function useWalletInfo() {
  return useQuery({
    queryKey: ["wallet-info"],
    queryFn: () => WalletService.getInfoWallet(),
  });
}
