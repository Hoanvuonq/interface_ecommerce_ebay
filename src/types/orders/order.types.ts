// Các loại hình thức hoàn trả
export type ReturnOrderType = "REFUND_ONLY" | "RETURN_REFUND";

export type ReturnOrderStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLETED";

import { BuyerAddressData } from "../cart/cart.types";
export interface ShippingAddressInfo {
  addressId?: string;
  country?: string;
  state?: string; // Province/State
  city?: string; // District/City
  postalCode?: string; // Postal/ZIP code
  addressLine1?: string;
  addressLine2?: string;

  districtNameOld?: string;
  provinceNameOld?: string;
  wardNameOld?: string;
}

export interface ShopSelectionRequest {
  shopId: string;
  allItems?: boolean;
  itemIds?: string[];
  vouchers?: string[];
  globalVouchers?: string[];
}

export interface OrderCreateRequest {
  shops: ShopSelectionRequest[];
  addressId?: string;
  recipientName?: string;
  phoneNumber?: string;
  detailAddress?: string;
  ward?: string;
  district?: string;
  buyerAddressData?: BuyerAddressData;
  province?: string;
  country?: string;
  email?: string;
  shippingMethod?:
    | "STANDARD"
    | "EXPRESS"
    | "ECONOMY"
    | "CONKIN"
    | "GHN"
    | "GHTK"
    | "VNPOST"
    | "NINJA_VAN"
    | "J&T"
    | "BEST_EXPRESS"
    | "FPT"
    | "OTHER";
  coupons?: string[];
  loyaltyPoints?: number;
  paymentMethod:
    | "COD"
    | "VNPAY"
    | "MOMO"
    | "BANK_TRANSFER"
    | "CREDIT_CARD"
    | "PAYOS";
  customerNote?: string;
  idempotencyKey?: string;
  shippingAddress?: ShippingAddressInfo;
  globalVouchers?: string[];
  previewId?: string;
  previewAt?: string;
  previewChecksum?: string;
  buyerAddressId?: string;
}

export interface OrderItemResponse {
  itemId: string;
  productId: string;
  variantId: string;
  sku: string;
  productName: string;
  imageBasePath?: string;
  imageExtension?: string;
  variantAttributes?: string;
  unitPrice: number;
  quantity: number;
  discountAmount: number;
  lineTotal: number;
  fulfillmentStatus?: string;
  reviewed?: boolean;
}

export interface ShopInfo {
  shopId: string;
  shopName: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  status: string;
  rejectedReason?: string | null;
  verifyBy?: string | null;
  verifyDate?: string | null;
  createdBy?: string | null;
  createdDate?: string | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: string | null;
  deleted: boolean;
  version: number;
  userId: string;
  username: string;
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  shopId?: string;
  shopInfo?: ShopInfo;
  buyerId: string;
  status: string;
  currency: string;
  subtotal: number;
  orderDiscount: number;
  totalDiscount: number;
  taxAmount: number;
  shippingFee: number;
  grandTotal: number;
  itemCount: number;
  totalQuantity: number;
  customerNote?: string;
  createdAt: string;
  reviewed?: boolean;
  items: OrderItemResponse[];
  // Payment
  paymentMethod: string;
  paymentUrl?: string;
  paymentIntentId?: string;
  expiresAt?: string;
  // PayOS specific fields (returned with order creation)
  payosQrCode?: string;
  payosAccountNumber?: string;
  payosAccountName?: string;
  payosOrderCode?: string;
  payosDepositId?: string;
  // Shipping/Tracking
  trackingNumber?: string;
  carrier?: string;
  conkinBillId?: string;
  conkinShippingCost?: number;
  shippingMethod?: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  updatedAt?: string;
  province: string;
  postalCode: string;
  country: string;
  email: string;
}

export interface ApiResponseOrder<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

// Saved Address types
export interface BuyerAddress {
  addressId: string;
  recipientName: string;
  phone: string;
  detailAddress: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  type: "HOME" | "OFFICE" | "OTHER";
  isDefault?: boolean;
}

export interface ReturnOrderRequest {
  reasonCode: string;
  reason: string;
  description: string;
  imageUrls: string[];
  videoUrls: string[];
  bankAccountId?: string;
}
