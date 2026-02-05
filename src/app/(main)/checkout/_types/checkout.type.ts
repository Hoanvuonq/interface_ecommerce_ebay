import {
  BuyerAddressData,
  CartItemPromotion,
  CouponInfo,
  LoyaltyPointsInfo,
  ShopPreview,
  ShopPreview2026,
  VoucherApplicationResponse,
  VoucherInfo,
} from "@/types/cart/cart.types";

export type CheckoutResponse =
  | CheckoutOrderPreviewRequest
  | CheckoutPreview2026;

export type shippingMethodType =
  | "STANDARD"
  | "EXPRESS"
  | "ECONOMY"
  | "GHN"
  | "CONKIN"
  | "SUPERSHIP";

export interface CheckoutValidationErrorResponse {
  message: string;
  errors: string[];
  invalidItems?: string[];
}

//================================= Shop Items =================================
export interface ShopItemInput {
  itemId: string;
  quantity: number;
}

export interface ShopSelection {
  shopId: string;
  items: ShopItemInput[];
  itemIds?: string[];
  vouchers?: string[];
  globalVouchers?: string[];
  shippingFee?: number;
  serviceCode?: number;
  internationalServiceCode?: number; // 2 cái mới thêm
  firstMileServiceCode?: number; // 2 cái mới thêm
  loyaltyPoints?: number;
}
//==============================================================================

export interface CheckoutSummary {
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  totalDiscount: number;
  shippingDiscount: number;
  productDiscount: number;
  totalShippingFee: number;
  totalTaxAmount: number;
  grandTotal: number;
}

export interface CheckoutPreview2026 {
  cartId: string;
  currency: string;
  previewAt: string;
  buyerAddressData: BuyerAddressData;
  shops: ShopPreview2026[];
  summary: CheckoutSummary;
  isValid: boolean;
  validationErrors: string[];
  warnings: string[];
}

export interface ShippingAddressInfo {
  addressId?: string;
  addressChanged?: boolean;
  country?: string;
  taxFee?: string;

  recipientName?: string;
  phoneNumber?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
}
//================================= Checkout Order Preview =================================
export interface CheckoutOrderPreviewRequest {
  shops?: ShopSelection[];
  shippingAddress?: ShippingAddressInfo;
  addressId?: string;
  loyaltyPoints?: number;
  paymentMethod?: string;
  usingSavedAddress?: boolean;
  previewAllSelected?: boolean;
  allDiscountCodes?: string[];
  allSelectedItemIds?: string[];
  effectiveAddressId?: string;
}
//==============================================================================
export interface OrderPreviewResponse {
  cartId: string;
  currency: string;
  previewAt: string;
  buyerAddressData?: BuyerAddressData;
  shops: ShopPreview[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  totalDiscount: number;
  shippingDiscount?: number;
  productDiscount?: number;
  totalShippingFee: number;
  totalTaxAmount: number;
  grandTotal: number;
  globalVouchers?: VoucherInfo[];
  appliedCoupons?: CouponInfo[];
  promotion: CartItemPromotion | null;
  voucherApplication?: VoucherApplicationResponse;
  loyaltyPointsInfo?: LoyaltyPointsInfo;
  isValid: boolean;
  validationErrors?: string[];
  warnings?: string[];
}
