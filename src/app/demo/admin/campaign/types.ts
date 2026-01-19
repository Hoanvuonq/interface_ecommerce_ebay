/**
 * Admin Campaign Types - Request/Response for Admin APIs
 */

import type {
    CampaignResponse,
    CampaignSlotProductResponse,
    CampaignSlotResponse,
    CampaignType
} from '../../campaign/types';

// Re-export shared types
export type { CampaignResponse, CampaignSlotProductResponse, CampaignSlotResponse, CampaignType };

// ============================================================
// REQUEST DTOs
// ============================================================

export interface CreateCampaignRequest {
    name: string;
    description?: string;
    campaignType: CampaignType;
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

export interface CreateSlotsRequest {
    slotDate: string;
    startTime: string;
    endTime: string;
    maxProducts?: number;
}

// ============================================================
// RESPONSE
// ============================================================

export interface CampaignStatisticsResponse {
    campaignId: string;
    totalSlots: number;
    activeSlots: number;
    totalRegistrations: number;
    approvedRegistrations: number;
    pendingRegistrations: number;
    rejectedRegistrations: number;
    totalSold: number;
    totalRevenue: number;
}

export interface PagedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}
