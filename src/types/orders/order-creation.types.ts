/**
 * Order Creation Response Types
 * For order creation from cart with payment information
 */

import type { OrderResponse } from "./order.types";

/**
 * Generic Payment Information for QR-based/Bank Transfer payments
 * Works for PayOS, MOMO, VNPay, etc.
 */
export interface PaymentInfo {
  paymentMethod: string; // "PAYOS", "MOMO", "VNPAY", etc.
  depositId?: string; // Optional: deposit/bin ID
  paymentLink?: string; // Payment URL/link
  qrCode: string; // QR code string for scanning
  accountNumber: string; // Bank account number
  accountName: string; // Bank account name
  orderCode: string; // Payment order code/reference
  amount: number; // Amount in cents/smallest unit
  currency: string; // "VND", "USD", etc.
  description?: string; // Payment description
  expiredAt?: string; // Payment expiration timestamp (ISO 8601 string)
}

/**
 * Response for order creation from cart
 * Contains list of orders (one per shop) and optional payment information
 */
export interface OrderCreationResponse {
  /**
   * List of orders created (one per shop)
   */
  orders: OrderResponse[];

  /**
   * Payment information for the total payment of all orders
   * Only present if payment method requires QR/bank transfer (PayOS, MOMO, etc.)
   */
  paymentInfo?: PaymentInfo;
}
