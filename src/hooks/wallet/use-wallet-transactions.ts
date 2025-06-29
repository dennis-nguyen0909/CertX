import { useQuery } from "@tanstack/react-query";
import { WalletService } from "@/services/wallet/wallet.service";

export function useWalletTransactions({
  type = "all",
  page = 1,
  size = 10,
}: {
  type?: string;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ["wallet-transactions", type, page, size],
    queryFn: () => WalletService.getTransactions({ type, page, size }),
  });
}
