/* eslint-disable @typescript-eslint/no-explicit-any */
import {request} from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import {ReturnRequest, ApproveReturnRequest, RejectReturnRequest, ReturnFilterOptions, OrderResponse} from "../_types/dto/shop.order.dto";
const API_ENDPOINT = "/v1/shop/returns";

// ==================== RETURN REQUEST APIs ====================

/**
 * Get return/refund requests
 * GET /api/v1/shop/returns
 */
export async function getReturnRequests(params : ReturnFilterOptions = {}) : Promise < ApiResponse < {
    content: ReturnRequest[];
    totalElements: number
} >> {
    return request < ApiResponse < {
        content: ReturnRequest[];
        totalElements: number
    } >> ({
        url: API_ENDPOINT,
        method: "GET",
        params: {
            status: params.status,
            type: params.type,
            fromDate: params.fromDate,
            toDate: params.toDate,
            page: params.page || 0,
            size: params.size || 10
        }
    });
}

/**
 * Get return request by ID
 * GET /api/v1/shop/returns/{requestId}
 */
export async function getReturnRequestById(requestId : string) : Promise < ApiResponse < ReturnRequest >> {
    return request < ApiResponse < ReturnRequest >> ({url: `${API_ENDPOINT}/${requestId}`, method: "GET"});
}

/**
 * Approve return request
 * PUT /api/v1/shop/returns/{requestId}/approve
 */
export async function approveReturnRequest(payload : ApproveReturnRequest) : Promise < ApiResponse < void >> {
    return request < ApiResponse < void >> ({
        url: `${API_ENDPOINT}/${payload.requestId}/approve`,
        method: "PUT",
        data: {
            note: payload.note
        }
    });
}

/**
 * Reject return request
 * PUT /api/v1/shop/returns/{requestId}/reject
 */
export async function rejectReturnRequest(payload : RejectReturnRequest) : Promise < ApiResponse < void >> {
    return request < ApiResponse < void >> ({
        url: `${API_ENDPOINT}/${payload.requestId}/reject`,
        method: "PUT",
        data: {
            reason: payload.reason
        }
    });
}

// ==================== CANCELLATION APIs ====================

/**
 * Get cancelled orders
 * GET /api/v1/shop/orders?status=CANCELLED
 */
export async function getCancelledOrders(params : {
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number
} = {}) : Promise < ApiResponse < {
    content: OrderResponse[];
    totalElements: number
} >> {
    return request < ApiResponse < {
        content: OrderResponse[];
        totalElements: number
    } >> ({
        url: "/v1/shop/orders",
        method: "GET",
        params: {
            status: "CANCELLED",
            fromDate: params.fromDate,
            toDate: params.toDate,
            page: params.page || 0,
            size: params.size || 10
        }
    });
}

// ==================== MOCK DATA (for development) ====================

/**
 * Mock function to generate sample return requests
 * Remove this when backend is ready
 */
export function getMockReturnRequests() : ReturnRequest[] {
    return [
        {
            requestId: "ret-001",
            orderId: "order-123",
            orderNumber: "ORD-2024-001",
            type: "RETURN_REFUND" as any,
            reason: "Hàng bị rách, không đúng mô tả",
            requester: "CUSTOMER",
            requesterId: "customer-001",
            requesterName: "Nguyễn Văn A",
            evidencePhotos: [
                "/images/evidence1.jpg", "/images/evidence2.jpg", "/images/evidence3.jpg"
            ],
            status: "PENDING" as any,
            deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            createdAt: new Date().toISOString(),
            productName: "Áo thun cotton cao cấp",
            productImage: "/images/product1.jpg",
            orderTotal: 250000
        }, {
            requestId: "ret-002",
            orderId: "order-124",
            orderNumber: "ORD-2024-002",
            type: "REFUND_ONLY" as any,
            reason: "Chưa nhận được hàng sau 15 ngày",
            requester: "CUSTOMER",
            requesterId: "customer-002",
            requesterName: "Trần Thị B",
            evidencePhotos: [],
            status: "PENDING" as any,
            deadline: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            productName: "Giày thể thao nam",
            productImage: "/images/product2.jpg",
            orderTotal: 500000
        }
    ];
}

/**
 * Mock function to generate sample cancelled orders
 */
export function getMockCancelledOrders() : OrderResponse[] {
    // This would return actual OrderResponse objects For now, returning empty array
    // as this will be replaced by real API
    return [];
}

// Export as service object
export const shopReturnService = {
    getReturnRequests,
    getReturnRequestById,
    approveReturnRequest,
    rejectReturnRequest,
    getCancelledOrders,
    getMockReturnRequests,
    getMockCancelledOrders
};
