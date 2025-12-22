/**
 * Payment Service - API calls cho payment management
 */

import { request } from '@/utils/axios.customize';
import type { ApiResponse } from '@/types/api.types';
import type {
    PayOSPaymentResponse,
    PayOSPaymentStatusResponse,
    PaymentStatusResponse,
} from '../../types/payment/payment.types';

const PAYMENT_API_BASE = '/v1/payments';

class PaymentService {
    /**
     * Lấy PayOS payment info (QR code, account info, etc.) theo order ID
     */
    async getPayOSPaymentInfo(orderId: string): Promise<PayOSPaymentResponse> {
        const response: ApiResponse<PayOSPaymentResponse> = await request({
            url: `${PAYMENT_API_BASE}/order/${orderId}/payos`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Check PayOS payment status theo orderCode
     */
    async checkPayOSPaymentStatus(orderCode: string): Promise<PayOSPaymentStatusResponse> {
        const response: ApiResponse<PayOSPaymentStatusResponse> = await request({
            url: `${PAYMENT_API_BASE}/payos/${orderCode}/status`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Cancel payment theo payment ID
     */
    async cancelPayment(paymentId: string): Promise<PaymentStatusResponse> {
        const response: ApiResponse<PaymentStatusResponse> = await request({
            url: `${PAYMENT_API_BASE}/${paymentId}/cancel`,
            method: 'POST',
        });
        return response.data;
    }

    /**
     * Cancel payment theo order ID
     */
    async cancelPaymentByOrder(orderId: string): Promise<PaymentStatusResponse> {
        const response: ApiResponse<PaymentStatusResponse> = await request({
            url: `${PAYMENT_API_BASE}/order/${orderId}/cancel`,
            method: 'POST',
        });
        return response.data;
    }

    /**
     * Get payment status theo payment ID
     */
    async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
        const response: ApiResponse<PaymentStatusResponse> = await request({
            url: `${PAYMENT_API_BASE}/${paymentId}/status`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Get payment status theo order ID
     */
    async getPaymentStatusByOrder(orderId: string): Promise<PaymentStatusResponse> {
        const response: ApiResponse<PaymentStatusResponse> = await request({
            url: `${PAYMENT_API_BASE}/order/${orderId}/status`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Verify payment status from PayOS and update order/payment
     * This endpoint checks PayOS API and updates status if payment is successful
     */
    async verifyPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
        const response: ApiResponse<PaymentStatusResponse> = await request({
            url: `${PAYMENT_API_BASE}/order/${orderId}/verify`,
            method: 'POST',
        });
        return response.data;
    }
}

export const paymentService = new PaymentService();

