/**
 * Payment Types - Type definitions for payment-related entities
 */

export interface PayOSPaymentResponse {
    depositId?: string;
    paymentLink?: string;
    qrCode: string; // Required for QR payment
    accountNumber: string; // Required for bank transfer info
    accountName: string; // Required for bank transfer info
    orderCode: string; // Required for payment tracking
    amount: number;
    currency: string;
    description?: string;
    expiredAt?: string;
}

export interface PayOSPaymentStatusResponse {
    id: string;
    orderCode: number;
    amount: number;
    amountPaid: number;
    amountRemaining: number;
    status: string; // PENDING, PAID, CANCELLED
    createdAt: string;
    transactions?: PayOSTransaction[];
    cancellationReason?: string;
    canceledAt?: string;
}

export interface PayOSTransaction {
    reference: string;
    amount: number;
    accountNumber: string;
    description: string;
    transactionDateTime: string;
    virtualAccountName?: string;
    virtualAccountNumber?: string;
    counterAccountBankId?: string;
    counterAccountBankName?: string;
    counterAccountName?: string;
    counterAccountNumber?: string;
}

export interface PaymentStatusResponse {
    paymentId: string;
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    method: string;
    provider: string;
    createdAt?: string;
    updatedAt?: string;
    paymentUrl?: string; // For renew payment URL
    expiresAt?: string; // For renew payment URL
}

