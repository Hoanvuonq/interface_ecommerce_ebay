/**
 * Shop Campaign Types - Request/Response for Shop APIs
 */

import type {
    CampaignResponse,
    CampaignSlotProductResponse,
    CampaignSlotResponse,
    CampaignType,
    CampaignStatus
} from './campaign.type';

// Re-export shared types
export type { CampaignResponse, CampaignSlotProductResponse, CampaignSlotResponse, CampaignType, CampaignStatus };

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

export interface ProductItem {
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
    bannerAssetId?: string;
    thumbnailAssetId?: string;
    displayPriority?: number;

    // Optional: Inline Product Registration
    products?: ProductItem[];
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
    slots?: CampaignSlotResponse[];
    products?: CampaignSlotProductResponse[]; // For SHOP_SALE detail
    totalSlots: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

// ============================================================
// PRODUCT SELECTION TYPES
// ============================================================

// Consolidated Image Fields: 1=Url, 2=Id
export interface ShopCampaignDetailResponse {
    id: string;
    name: string;
    description: string;
    campaignType: CampaignType;
    status: CampaignStatus;
    startDate: string; // ISO Date
    endDate: string; // ISO Date

    banner?: string;
    bannerId?: string;
    thumbnail?: string;
    thumbnailId?: string;

    products: CampaignSlotProductResponse[];
}

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
