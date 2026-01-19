/**
 * Campaign Service - API calls for campaign feature
 * Location: demo/campaign/campaign.service.ts
 * 
 * NOTE: This service is local to demo folder, using the shared axios instance
 */

import { request } from '@/utils/axios.customize';
import type { ApiResponse } from '@/api/_types/api.types';
import type {
    CampaignResponse,
    CampaignSlotResponse,
    CampaignSlotProductResponse
} from './types';

const PUBLIC_API = '/v1/campaigns';

class CampaignService {
    // ============================================================
    // CAMPAIGN QUERIES
    // ============================================================

    /**
     * Get currently active campaigns
     */
    async getActiveCampaigns(): Promise<CampaignResponse[]> {
        const response: ApiResponse<CampaignResponse[]> = await request({
            url: `${PUBLIC_API}/active`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Get upcoming campaigns
     */
    async getUpcomingCampaigns(): Promise<CampaignResponse[]> {
        const response: ApiResponse<CampaignResponse[]> = await request({
            url: `${PUBLIC_API}/upcoming`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Get featured campaigns
     */
    async getFeaturedCampaigns(): Promise<CampaignResponse[]> {
        const response: ApiResponse<CampaignResponse[]> = await request({
            url: `${PUBLIC_API}/featured`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Get campaign detail with slots
     */
    async getCampaignDetail(campaignId: string): Promise<CampaignResponse> {
        const response: ApiResponse<CampaignResponse> = await request({
            url: `${PUBLIC_API}/${campaignId}`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Get all products in a campaign
     */
    async getCampaignProducts(campaignId: string): Promise<CampaignSlotResponse[]> {
        const response: ApiResponse<CampaignSlotResponse[]> = await request({
            url: `${PUBLIC_API}/${campaignId}/products`,
            method: 'GET',
        });
        return response.data;
    }

    // ============================================================
    // SLOT QUERIES
    // ============================================================

    /**
     * Get currently active slots (for Flash Sale banner)
     */
    async getActiveSlots(): Promise<CampaignSlotResponse[]> {
        const response: ApiResponse<CampaignSlotResponse[]> = await request({
            url: `${PUBLIC_API}/slots/active`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Get upcoming slots (next N hours)
     */
    async getUpcomingSlots(hours: number = 6): Promise<CampaignSlotResponse[]> {
        const response: ApiResponse<CampaignSlotResponse[]> = await request({
            url: `${PUBLIC_API}/slots/upcoming`,
            method: 'GET',
            params: { hours },
        });
        return response.data;
    }

    /**
     * Get slots by date
     */
    async getSlotsByDate(date: string): Promise<CampaignSlotResponse[]> {
        const response: ApiResponse<CampaignSlotResponse[]> = await request({
            url: `${PUBLIC_API}/slots/date/${date}`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Get slot detail with products
     */
    async getSlotDetail(slotId: string): Promise<CampaignSlotResponse> {
        const response: ApiResponse<CampaignSlotResponse> = await request({
            url: `${PUBLIC_API}/slots/${slotId}`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Get products in a specific slot
     */
    async getProductsInSlot(slotId: string): Promise<CampaignSlotProductResponse[]> {
        const response: ApiResponse<CampaignSlotProductResponse[]> = await request({
            url: `${PUBLIC_API}/slots/${slotId}/products`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Search slots with flexible filtering
     */
    async searchSlots(params: {
        date: string;
        startHour?: number;
        endHour?: number;
        status?: string;
    }): Promise<CampaignSlotResponse[]> {
        const response: ApiResponse<CampaignSlotResponse[]> = await request({
            url: `${PUBLIC_API}/slots/search`,
            method: 'GET',
            params,
        });
        return response.data;
    }
}

export const campaignService = new CampaignService();
