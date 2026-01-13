/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import {
    ShippingCarrier,
    UpdateCarrierRequest,
    CarrierCategory,
} from "../_types/dto/shop.order.dto";

const API_ENDPOINT = "/v1/shop/carriers";

// ==================== CARRIER CONFIGURATION APIs ====================

/**
 * Get all shipping carriers
 * GET /api/v1/shop/carriers
 */
export async function getCarriers(): Promise<ApiResponse<ShippingCarrier[]>> {
    return request<ApiResponse<ShippingCarrier[]>>({
        url: API_ENDPOINT,
        method: "GET",
    });
}

/**
 * Get carrier by ID
 * GET /api/v1/shop/carriers/{carrierId}
 */
export async function getCarrierById(
    carrierId: string
): Promise<ApiResponse<ShippingCarrier>> {
    return request<ApiResponse<ShippingCarrier>>({
        url: `${API_ENDPOINT}/${carrierId}`,
        method: "GET",
    });
}

/**
 * Update carrier configuration
 * PUT /api/v1/shop/carriers/{carrierId}
 */
export async function updateCarrier(
    payload: UpdateCarrierRequest
): Promise<ApiResponse<ShippingCarrier>> {
    return request<ApiResponse<ShippingCarrier>>({
        url: `${API_ENDPOINT}/${payload.carrierId}`,
        method: "PUT",
        data: payload,
    });
}

/**
 * Toggle carrier enabled/disabled
 * PUT /api/v1/shop/carriers/{carrierId}/toggle
 */
export async function toggleCarrier(
    carrierId: string,
    enabled: boolean
): Promise<ApiResponse<void>> {
    return request<ApiResponse<void>>({
        url: `${API_ENDPOINT}/${carrierId}/toggle`,
        method: "PUT",
        data: { enabled },
    });
}

/**
 * Preview AWB template for carrier
 * GET /api/v1/shop/carriers/{carrierId}/awb-preview
 */
export async function previewAWBTemplate(carrierId: string): Promise<Blob> {
    const response = await request<Blob>({
        url: `${API_ENDPOINT}/${carrierId}/awb-preview`,
        method: "GET",
        responseType: "blob",
    });
    return response as unknown as Blob;
}

// ==================== MOCK DATA (for development) ====================

/**
 * Mock function to generate sample carriers
 * Remove this when backend is ready
 */
export function getMockCarriers(): ShippingCarrier[] {
    return [
        // EXPRESS - Hỏa tốc
        {
            carrierId: "carrier-express-sameday",
            name: "EXPRESS_SAME_DAY",
            displayName: "Trong Ngày",
            category: "EXPRESS" as CarrierCategory,
            enabled: true,
            codEnabled: true,
            maxWeight: 20,
            maxDimensions: { length: 60, width: 40, height: 40 },
            feeRange: { min: 30000, max: 80000 },
            serviceArea: ["TP. Hồ Chí Minh", "Hà Nội"],
            description: "Giao hàng trong ngày, nhận hàng trước 12h giao trong ngày",
            logo: "/carriers/express-logo.png",
        },
        {
            carrierId: "carrier-express-4h",
            name: "EXPRESS_4H",
            displayName: "4 Giờ",
            category: "EXPRESS" as CarrierCategory,
            enabled: true,
            codEnabled: true,
            maxWeight: 5,
            maxDimensions: { length: 40, width: 30, height: 30 },
            feeRange: { min: 50000, max: 120000 },
            serviceArea: ["TP. Hồ Chí Minh - Nội thành"],
            description: "Giao hàng siêu tốc trong 4 giờ",
            logo: "/carriers/express-logo.png",
        },

        // FAST - Nhanh
        {
            carrierId: "carrier-fast-standard",
            name: "FAST_STANDARD",
            displayName: "Nhanh",
            category: "FAST" as CarrierCategory,
            enabled: true,
            codEnabled: true,
            maxWeight: 30,
            maxDimensions: { length: 100, width: 100, height: 100 },
            feeRange: { min: 15000, max: 50000 },
            serviceArea: ["Toàn quốc"],
            description: "Giao hàng nhanh tiêu chuẩn 2-3 ngày",
            logo: "/carriers/fast-logo.png",
            awbTemplate: "/carriers/fast-awb-template.pdf",
        },

        // LOCKER - Tủ nhận hàng
        {
            carrierId: "carrier-locker",
            name: "LOCKER_PICKUP",
            displayName: "Tủ Nhận Hàng",
            category: "LOCKER" as CarrierCategory,
            enabled: false,
            codEnabled: false,
            maxWeight: 10,
            maxDimensions: { length: 50, width: 50, height: 50 },
            serviceArea: ["TP. Hồ Chí Minh", "Hà Nội"],
            description: "Khách hàng tự lấy hàng tại tủ locker",
            logo: "/carriers/locker-logo.png",
        },

        // BULKY - Hàng cồng kềnh
        {
            carrierId: "carrier-bulky",
            name: "BULKY_DELIVERY",
            displayName: "Hàng Cồng Kềnh",
            category: "BULKY" as CarrierCategory,
            enabled: true,
            codEnabled: true,
            maxWeight: 200,
            maxDimensions: { length: 200, width: 150, height: 150 },
            feeRange: { min: 100000, max: 500000 },
            serviceArea: ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng"],
            description: "Giao hàng lớn, cồng kềnh với đội ngũ chuyên nghiệp",
            logo: "/carriers/bulky-logo.png",
        },
    ];
}

/**
 * Get carriers grouped by category
 */
export function getCarriersByCategory(
    carriers: ShippingCarrier[]
): Record<CarrierCategory, ShippingCarrier[]> {
    const grouped: Record<CarrierCategory, ShippingCarrier[]> = {
        EXPRESS: [],
        FAST: [],
        LOCKER: [],
        BULKY: [],
        THIRD_PARTY: [],
    };

    carriers.forEach((carrier) => {
        grouped[carrier.category].push(carrier);
    });

    return grouped;
}

// Export as service object
export const shopCarrierService = {
    getCarriers,
    getCarrierById,
    updateCarrier,
    toggleCarrier,
    previewAWBTemplate,
    getMockCarriers,
    getCarriersByCategory,
};
