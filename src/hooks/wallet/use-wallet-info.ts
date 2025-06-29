import { useServices } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useWalletInfo() {
  const { WalletService } = useServices();
  return useQuery({
    queryKey: ["wallet-info"],
    queryFn: () => WalletService.getInfoWallet(),
  });
}
