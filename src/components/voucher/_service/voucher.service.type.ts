export interface VoucherTemplateResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  voucherScope: "SHOP_ORDER" | "SHIPPING" | "PRODUCT" | "ORDER";
  discountType: "FIXED_AMOUNT" | "PERCENTAGE";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  creatorType: "PLATFORM" | "SHOP";
  sponsorType: "PLATFORM" | "SHOP";
  purchasable: boolean;
  price: number;
  maxUsage: number;
  validityDays: number | null;
  maxPurchasePerShop: number | null;
  applyToAllShops: boolean;
  applyToAllProducts: boolean;
  applyToAllCustomers: boolean;
  shopIds: string[] | null;
  productIds: string[] | null;
  customerIds: string[] | null;
  active: boolean;
  createdDate: string;
  lastModifiedDate: string;
  imageBasePath: string;
  imageExtension: string;
}

export interface VoucherRecommendationResult {
  voucher: VoucherTemplateResponse;
  applicable: boolean;
  reason: string | null;
  calculatedDiscount: number;
}

export interface PlatformVoucherRecommendationsData {
  productOrderVouchers: VoucherRecommendationResult[];
  shippingVouchers: VoucherRecommendationResult[];
}

export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export type PlatformVoucherRecommendationsResponse =
  ApiResponse<PlatformVoucherRecommendationsData>;

export interface VoucherOption {
  id: string;
  code: string;
  name: string;
  description: string;
  imageBasePath: string | null;
  imageExtension: string | null;
  discountValue: number;
  calculatedDiscount: number;
  discountType: "FIXED_AMOUNT" | "PERCENTAGE";
  minOrderAmount: number;
  maxDiscount: number | null;
  applicable: boolean;
  reason: string | null;
  isValid?: boolean;
  maxUsage: number;
  voucherScope: "SHOP_ORDER" | "SHIPPING" | "PRODUCT" | "ORDER";
  startDate: string;
  endDate: string;
  canSelect?: boolean;
}
