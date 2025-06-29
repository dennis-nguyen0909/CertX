import { WalletInfo } from "@/models/transaction";
import api from "../config/axios";

export const WalletService = {
  getInfoWallet: async () => {
    const response = await api.get<WalletInfo>(`v1/pdt/wallet-info`);
    return response.data;
  },
  getTransactions: async ({
    type = "all",
    page = 1,
    size = 10,
  }: {
    type?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await api.get(`/v1/pdt/transactions`, {
      params: { type, page, size },
    });
    return response.data;
  },
};
