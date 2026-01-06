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
  startDate: string; // ISO Date String
  endDate: string;   // ISO Date String
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

// 2. Interface cho kết quả gợi ý voucher (bao gồm logic check applicable)
export interface VoucherRecommendationResult {
  voucher: VoucherTemplateResponse;
  applicable: boolean;
  reason: string | null;
  calculatedDiscount: number;
}

// 3. Interface cho Data object trả về từ API
export interface PlatformVoucherRecommendationsData {
  productOrderVouchers: VoucherRecommendationResult[];
  shippingVouchers: VoucherRecommendationResult[];
}

// 4. Interface tổng của API Response
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

// Type alias để sử dụng nhanh
export type PlatformVoucherRecommendationsResponse = ApiResponse<PlatformVoucherRecommendationsData>;

export interface VoucherOption {
  id: string;
  code: string;
  name: string;
  description: string;
  imageBasePath: string | null;
  imageExtension: string | null;
  discountValue: number; // Theo API
  calculatedDiscount: number; // Giá trị giảm thực tế
  discountType: "FIXED_AMOUNT" | "PERCENTAGE";
  minOrderAmount: number;
  maxDiscount: number | null;
  applicable: boolean; // Thay cho isValid để đồng bộ API
  reason: string | null;
  isValid?: boolean;
  maxUsage: number;
  voucherScope: "SHOP_ORDER" | "SHIPPING" | "PRODUCT" | "ORDER";
  startDate: string;
  endDate: string;
  canSelect?: boolean;
}