import { WalletInfo } from "@/models/transaction";
import api from "../config/axios";

export const STUCoinService = {
  getInfoSTUCoinOfStudent: async () => {
    const response = await api.get<WalletInfo>(`v1/pdt/wallet-info`);
    return response.data;
  },
};
