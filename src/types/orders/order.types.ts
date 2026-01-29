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
  imagePath?: string;
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

// Pricing info from API response
export interface OrderPricing {
  subtotal: number;
  shopDiscount: number;
  platformDiscount: number;
  shippingDiscount: number;
  originalShippingFee: number;
  appliedVoucherCodes?: string;
  totalDiscount: number;
  taxAmount: number;
  shippingFee: number;
  grandTotal: number;
}

// Payment info from API response
export interface OrderPayment {
  method: string;
  url?: string | null;
  intentId?: string | null;
  groupId?: string | null;
  expiresAt?: string | null;
}

// Shipment info from API response
export interface OrderShipment {
  trackingNumber?: string | null;
  carrier?: string | null;
}

// Shipping address from API response
export interface OrderShippingAddress {
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  email?: string;
}

// Loyalty info from API response
export interface OrderLoyalty {
  pointsUsed: number;
  discountAmount: number;
  pointsEarned: number;
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  shopId?: string | null;
  shopInfo?: ShopInfo | null;
  buyerId?: string;
  status: string;
  currency?: string;
  
  // New nested structure from API
  pricing?: OrderPricing;
  payment?: OrderPayment;
  shipment?: OrderShipment;
  shippingAddress?: OrderShippingAddress;
  loyalty?: OrderLoyalty;
  
  // Legacy flat fields (for backward compatibility)
  subtotal?: number;
  orderDiscount?: number;
  totalDiscount?: number;
  taxAmount?: number;
  shippingFee?: number;
  grandTotal?: number;
  
  itemCount: number;
  totalQuantity: number;
  customerNote?: string;
  cancellationReason?: string | null;
  createdAt?: string | null;
  updatedAt?: string;
  reviewed?: boolean;
  items: OrderItemResponse[];
  
  // Legacy payment fields (for backward compatibility)
  paymentMethod?: string;
  paymentUrl?: string;
  paymentIntentId?: string;
  expiresAt?: string;
  payosQrCode?: string;
  payosAccountNumber?: string;
  payosAccountName?: string;
  payosOrderCode?: string;
  payosDepositId?: string;
  
  // Legacy shipment fields
  trackingNumber?: string;
  carrier?: string;
  conkinBillId?: string;
  conkinShippingCost?: number;
  shippingMethod?: string;
  
  // Legacy address fields
  recipientName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  email?: string;
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

