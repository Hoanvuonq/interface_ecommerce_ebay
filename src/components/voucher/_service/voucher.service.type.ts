export interface VoucherTemplateResponse {
  id: string;
  code: string;
  name?: string;
  description?: string;
  discountAmount?: number;
  discountValue?: number; // API trả về discountValue
  discountType?: "PERCENTAGE" | "FIXED" | "FIXED_AMOUNT" | "PERCENTAGE_AMOUNT";
  minOrderValue?: number;
  minOrderAmount?: number; // API trả về minOrderAmount
  maxDiscount?: number;
  voucherScope?: "SHOP_ORDER" | "SHIPPING" | "PRODUCT" | "ORDER";
  active?: boolean;
  maxUsage?: number;
  usedCount?: number;
  [key: string]: any;
}

export interface VoucherRecommendationResult {
  voucher: VoucherTemplateResponse;
  applicable: boolean;
  reason?: string;
}

export interface PlatformVoucherRecommendationsResponse {
  productOrderVouchers?: VoucherRecommendationResult[];
  shippingVouchers?: VoucherRecommendationResult[];
}

export interface VoucherOption {
  id: string;
  code: string;
  name?: string;
  description?: string;
  imageBasePath?: string | null;
  imageExtension?: string | null;
  discountAmount?: number;
  discountType?: "PERCENTAGE" | "FIXED";
  minOrderValue?: number;
  maxDiscount?: number;
  isValid?: boolean;
  maxUsage?: number;
  usedCount?: number;
  remainingCount?: number;
  voucherScope?: "SHOP_ORDER" | "SHIPPING" | "PRODUCT" | "ORDER";
  remainingPercentage?: number;
  canSelect?: boolean;
  reason?: string;
}
