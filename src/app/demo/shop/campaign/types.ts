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
    salePrice?: number;
    discountPercent?: number;
    stockLimit: number;
    purchaseLimitPerUser?: number;
    displayPriority?: number;
}

export interface CreateShopCampaignRequest {
    name: string;
    description?: string;
    campaignType: 'SHOP_SALE';
    startDate: string;
    endDate: string;
    isRecurring?: boolean;
    recurringStartTime?: string;
    recurringEndTime?: string;
    slotTimes?: string[];
    slotDurationMinutes?: number;
    bannerUrl?: string;
    thumbnailUrl?: string;
    displayPriority?: number;
    isFeatured?: boolean;
}

export interface UpdateCampaignRequest {
    name?: string;
    description?: string;
    bannerUrl?: string;
    thumbnailUrl?: string;
    displayPriority?: number;
    isFeatured?: boolean;
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
