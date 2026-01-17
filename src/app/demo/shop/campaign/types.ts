/**
 * Shop Campaign Types - Request/Response for Shop APIs
 */

import type {
    CampaignResponse,
    CampaignSlotProductResponse,
    CampaignSlotResponse
} from '../../campaign/types';

// Re-export shared types
export type { CampaignResponse, CampaignSlotProductResponse, CampaignSlotResponse };

// ============================================================
// REQUEST DTOs
// ============================================================

export interface RegisterProductRequest {
    slotId: string;
    variantId: string;
    salePrice: number;
    stockLimit: number;
    purchaseLimitPerUser?: number;
    displayPriority?: number;
}

export interface CreateShopCampaignRequest {
    name: string;
    description?: string;
    startDate: string; // "YYYY-MM-DDTHH:mm"
    endDate: string;   // "YYYY-MM-DDTHH:mm"

    displayPriority?: number;

    // Optional: Inline Product Registration
    products?: {
        variantId: string;
        salePrice: number;
        stockLimit: number;
        purchaseLimitPerUser?: number;
        displayPriority?: number;
    }[];
}

export interface UpdateCampaignRequest {
    name?: string;
    description?: string;
    bannerAssetId?: string;
    thumbnailAssetId?: string;
    displayPriority?: number;
}

// ============================================================
// RESPONSE - Paginated
// ============================================================

export interface PagedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

// ============================================================
// PRODUCT SELECTION TYPES
// ============================================================

export interface ProductResponse {
    id: string;
    name: string;
    active: boolean;
    approvalStatus: string;
    variants: ProductVariantResponse[];
}

export interface ProductVariantResponse {
    id: string;
    sku: string;
    imageUrl?: string;
    price: number;
    hasStock: boolean;
    optionValues?: {
        optionName: string;
        valueName: string;
    }[];
}
