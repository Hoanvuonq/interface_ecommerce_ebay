/**
 * Order Types - DTOs cho order management
 */

export interface ShippingAddressInfo {
    // Option 1: Use saved address
    addressId?: string;

    // Option 2: Provide full address (matching backend OrderPreviewRequest.ShippingAddressInfo)
    country?: string;
    state?: string; // Province/State
    city?: string; // District/City
    postalCode?: string; // Postal/ZIP code
    addressLine1?: string;
    addressLine2?: string;

    // Old format address names (for backend compatibility)
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
    shippingMethod?: 'STANDARD' | 'EXPRESS' | 'ECONOMY' | 'CONKIN';
    coupons?: string[];
    loyaltyPoints?: number;
    paymentMethod: 'COD' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'PAYOS';
    customerNote?: string;
    idempotencyKey?: string;
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
    province: string;
    postalCode: string;
    country: string;
    email: string;
}

export interface ApiResponse<T> {
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
    type: 'HOME' | 'OFFICE' | 'OTHER';
    isDefault?: boolean;
}

