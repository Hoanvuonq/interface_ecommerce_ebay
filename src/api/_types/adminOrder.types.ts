export interface OrderItemResponse {
  itemId: string;
  productId: string;
  variantId: string;
  sku: string;
  productName: string;
  imageBasePath: string | null;
  imageExtension: string | null;
  variantAttributes: any;
  unitPrice: number;
  quantity: number;
  discountAmount: number;
  lineTotal: number;
  reviewed: boolean;
}

export interface ShopResponse {
  userId: string;
  shopId: string;
  shopName: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  status: string;
  onVacation: boolean;
  shop_location: string;
  place: string;
  last_active_time: string | null;
  createdAt: string | null;
  statistics: any;
}

export interface OrderPricingResponse {
  subtotal: number;
  shopDiscount: number;
  platformDiscount: number;
  shippingDiscount: number;
  originalShippingFee: number;
  appliedVoucherCodes: string | null;
  totalDiscount: number;
  taxAmount: number;
  shippingFee: number;
  grandTotal: number;
  totalPlatformFee: number | null;
  netRevenue: number | null;
}

export interface OrderPaymentResponse {
  method: string;
  url: string | null;
  intentId: string | null;
  groupId: string | null;
  expiresAt: string | null;
}

export interface OrderShipmentResponse {
  trackingNumber: string | null;
  carrier: string;
}

export interface ShippingAddressResponse {
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  email: string;
}

export interface OrderResponseAdmin {
  orderId: string;
  orderNumber: string;
  shopId: string;
  shopInfo: ShopResponse;
  buyerId: string;
  status: string;
  currency: string;
  pricing: OrderPricingResponse;
  itemCount: number;
  totalQuantity: number;
  customerNote: string;
  internalNote: string | null;
  cancellationReason: string | null;
  createdAt: string;
  items: OrderItemResponse[];
  payment: OrderPaymentResponse;
  shipment: OrderShipmentResponse;
  paymentMethod: string;
  paymentUrl: string;
  paymentIntentId: string;
  conkinBillId: string;
  conkinShippingCost: number;
  shippingAddress: ShippingAddressResponse;
}
export interface OrderStatisticsResponse {
  // Define fields if needed later
}

export interface OrderStatusUpdateRequest {
  status: string;
  note?: string;
}

export interface OrderCancelRequest {
  reason: string;
}
