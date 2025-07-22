import { useQuery } from "@tanstack/react-query";
import { WalletService } from "@/services/wallet/wallet.service";

export function useWalletTransactionsOfStudent({
  page = 1,
  size = 25,
}: {
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ["wallet-transactions-student", page, size],
    queryFn: () => WalletService.getTransactionsOfStudents({ page, size }),
  });
}
