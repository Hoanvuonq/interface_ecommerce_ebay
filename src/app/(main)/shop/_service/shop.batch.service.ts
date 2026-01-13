/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import {
    ShippingBatch,
    CreateBatchRequest,
    ConfirmHandoverRequest,
    BatchFilterOptions,
    PickupLocation,
}  from "../_types/dto/shop.order.dto";

const API_ENDPOINT = "/v1/shop/batches";

// ==================== BATCH MANAGEMENT APIs ====================

/**
 * Get shipping batches
 * GET /api/v1/shop/batches
 */
export async function getBatches(
    params: BatchFilterOptions = {}
): Promise<ApiResponse<{ content: ShippingBatch[]; totalElements: number }>> {
    return request<ApiResponse<{ content: ShippingBatch[]; totalElements: number }>>({
        url: API_ENDPOINT,
        method: "GET",
        params: {
            status: params.status,
            carrier: params.carrier,
            fromDate: params.fromDate,
            toDate: params.toDate,
            page: params.page || 0,
            size: params.size || 10,
        },
    });
}

/**
 * Get batch by ID
 * GET /api/v1/shop/batches/{batchId}
 */
export async function getBatchById(
    batchId: string
): Promise<ApiResponse<ShippingBatch>> {
    return request<ApiResponse<ShippingBatch>>({
        url: `${API_ENDPOINT}/${batchId}`,
        method: "GET",
    });
}

/**
 * Create shipping batch
 * POST /api/v1/shop/batches
 */
export async function createBatch(
    payload: CreateBatchRequest
): Promise<ApiResponse<ShippingBatch>> {
    return request<ApiResponse<ShippingBatch>>({
        url: API_ENDPOINT,
        method: "POST",
        data: payload,
    });
}

/**
 * Confirm batch handover to driver
 * PUT /api/v1/shop/batches/{batchId}/handover
 */
export async function confirmHandover(
    payload: ConfirmHandoverRequest
): Promise<ApiResponse<void>> {
    return request<ApiResponse<void>>({
        url: `${API_ENDPOINT}/${payload.batchId}/handover`,
        method: "PUT",
        data: payload,
    });
}

/**
 * Cancel batch
 * PUT /api/v1/shop/batches/{batchId}/cancel
 */
export async function cancelBatch(
    batchId: string,
    reason?: string
): Promise<ApiResponse<void>> {
    return request<ApiResponse<void>>({
        url: `${API_ENDPOINT}/${batchId}/cancel`,
        method: "PUT",
        data: { reason },
    });
}

/**
 * Print AWB (Air Waybill) for batch
 * GET /api/v1/shop/batches/{batchId}/awb
 * Returns PDF blob
 */
export async function printBatchAWB(batchId: string): Promise<Blob> {
    const response = await request<Blob>({
        url: `${API_ENDPOINT}/${batchId}/awb`,
        method: "GET",
        responseType: "blob",
    });
    return response as unknown as Blob;
}

/**
 * Print handover receipt for batch
 * GET /api/v1/shop/batches/{batchId}/receipt
 * Returns PDF blob
 */
export async function printHandoverReceipt(batchId: string): Promise<Blob> {
    const response = await request<Blob>({
        url: `${API_ENDPOINT}/${batchId}/receipt`,
        method: "GET",
        responseType: "blob",
    });
    return response as unknown as Blob;
}

// ==================== PICKUP LOCATION APIs ====================

/**
 * Get pickup locations
 * GET /api/v1/shop/pickup-locations
 */
export async function getPickupLocations(): Promise<
    ApiResponse<PickupLocation[]>
> {
    return request<ApiResponse<PickupLocation[]>>({
        url: "/v1/shop/pickup-locations",
        method: "GET",
    });
}

/**
 * Get default pickup location
 */
export async function getDefaultPickupLocation(): Promise<
    ApiResponse<PickupLocation>
> {
    return request<ApiResponse<PickupLocation>>({
        url: "/v1/shop/pickup-locations/default",
        method: "GET",
    });
}

// ==================== MOCK DATA (for development) ====================

/**
 * Mock function to generate sample batches
 * Remove this when backend is ready
 */
export function getMockBatches(): ShippingBatch[] {
    return [
        {
            batchId: "batch-001",
            batchNumber: "BA001",
            createdAt: new Date().toISOString(),
            orderCount: 25,
            carrier: "Shopee Express",
            pickupLocation: "Kho chính - 123 Nguyễn Văn Linh, Q7, HCM",
            pickupDate: new Date().toISOString(),
            pickupTime: "14:00 - 16:00",
            driverName: "Nguyễn Văn Minh",
            driverPhone: "0987654321",
            status: "READY" as any,
            orders: [],
            notes: "Batch giao hàng buổi chiều",
        },
        {
            batchId: "batch-002",
            batchNumber: "BA002",
            createdAt: new Date().toISOString(),
            orderCount: 30,
            carrier: "VNPost",
            pickupLocation: "Kho chính - 123 Nguyễn Văn Linh, Q7, HCM",
            pickupDate: new Date().toISOString(),
            pickupTime: "10:00 - 12:00",
            status: "PENDING" as any,
            orders: [],
        },
    ];
}

// Export as service object
export const shopBatchService = {
    getBatches,
    getBatchById,
    createBatch,
    confirmHandover,
    cancelBatch,
    printBatchAWB,
    printHandoverReceipt,
    getPickupLocations,
    getDefaultPickupLocation,
    getMockBatches,
};
