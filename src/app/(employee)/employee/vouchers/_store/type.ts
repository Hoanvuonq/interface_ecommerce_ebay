// store/useVoucherStore.ts
import { Dayjs } from "dayjs";
import {
    CreatorType,
    DiscountType,
    VoucherScope
} from "../_types/voucher-v2.type";

export interface FilterState {
  scope: "all" | "platform" | "shop";
  q: string;
  active?: boolean | null;
  purchasable?: boolean | null;
  creatorType?: CreatorType | null;
  voucherScope?: VoucherScope | null;
  discountType?: DiscountType | null;
  dateRange?: [Dayjs | null, Dayjs | null] | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}
