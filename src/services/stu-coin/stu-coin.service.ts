import { WalletInfo } from "@/models/transaction";
import api from "../config/axios";

export const STUCoinService = {
  getInfoSTUCoinOfStudent: async () => {
    const response = await api.get<WalletInfo>(`v1/pdt/wallet-info`);
    return response.data;
  },
  exchangeToken: async (id: number, amount: number) => {
    const response = await api.post("v1/khoa/payments/exchange-token", null, {
      params: { id, amount },
    });
    return response.data;
  },
  studentTransferToken: async (toAddress: string, amount: number) => {
    const response = await api.post(
      "v1/student/tokens/student-transfer",
      null,
      {
        params: { toAddress, amount },
      }
    );
    return response.data;
  },
  mintToken: async (amount: number) => {
    const response = await api.post("v1/pdt/tokens/mint", null, {
      params: { amount },
    });
    return response.data;
  },
};
