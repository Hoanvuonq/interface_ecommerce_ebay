export type VoucherTabKey =
  | "my-vouchers"
  | "platform-market"
  | "purchased"
  | "statistics"
  | "history";

export interface TabCounts {
  myVouchers: number;
  activeVouchers: number;
  platformAvailable: number;
  purchasableByShop: number;
  transactions: number;
}
