export interface OrderItemResponse {
    itemId: string;
    productId: string;
    variantId: string;
    sku: string;
    productName: string;
    imageBasePath: string;
    imageExtension: string;
    variantAttributes: string;
    unitPrice: number;
    quantity: number;
    discountAmount: number;
    lineTotal: number;
    fulfillmentStatus: string;
    reviewed: boolean;
}

export interface ShopResponse {
    shopId: string;
    shopName: string;
    logoUrl: string;
    // Add other fields if necessary
}

export interface OrderResponse {
    orderId: string;
    orderNumber: string;
    shopId: string;
    shopInfo: ShopResponse;
    buyerId: string;
    status: string;
    currency: string;
    subtotal: number;
    shippingDiscount: number;
    taxAmount: number;
    shippingFee: number;
    grandTotal: number;
    itemCount: number;
    totalQuantity: number;
    customerNote: string;
    internalNote: string;
    cancellationReason: string;
    createdAt: string; // OffsetDateTime string
    items: OrderItemResponse[];

    // Payment fields
    paymentMethod: string;
    paymentUrl: string;
    paymentIntentId: string;
    expiresAt: string;

    // Shipping/Tracking fields
    trackingNumber: string;
    carrier: string;
    conkinBillId: string;
    conkinShippingCost: number;

    // Shipping address snapshot
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
