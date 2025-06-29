export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  asset: string;
  blockNum: string;
  blockTimestamp: string;
  direction: "IN" | "OUT";
  gasPrice: string;
  gasUsed: string;
  transactionFee: string;
}

export interface WalletInfo {
  address: string;
  balanceEth: string;
  gasPriceGwei: string;
  nonce: number;
}
export const exampleTransaction: Transaction = {
  hash: "0xda113e01bd2b30757e2acc0491bddfcdf48cbb18b80e66f500387ce75b4636e2",
  from: "0x013487d8f807e014a48c35bb6f9bd0bb79b111d2",
  to: "0x151905935412036a364c25b63e89322186c4edc4",
  value: "0",
  asset: "ETH",
  blockNum: "0x82dd56",
  blockTimestamp: "2025-06-18T14:45:48.000Z",
  direction: "OUT",
  gasPrice: "20000000000",
  gasUsed: "42340",
  transactionFee: "846800000000000",
};
