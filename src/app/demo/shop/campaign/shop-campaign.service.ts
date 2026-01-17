/**
 * Shop Campaign Service - API calls for shop campaign management
 */

import { request } from '@/utils/axios.customize';
import type { ApiResponse } from '@/api/_types/api.types';
import type {
    CampaignResponse,
    CampaignSlotProductResponse,
    RegisterProductRequest,
    CreateShopCampaignRequest,
    UpdateCampaignRequest,
    PagedResponse,
    ProductResponse,
} from './types';

const SHOP_API = '/v1/shop';
const USER_API = '/v1/user';

// Helper for Idempotency-Key
const generateIdempotencyKey = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        try { return crypto.randomUUID(); } catch (e) { }
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

class ShopCampaignService {
    // ============================================================
    // PRODUCT REGISTRATION (Join Platform Campaigns)
    // ============================================================

    /**
     * Register a product for a campaign slot
     */
    async registerProduct(req: RegisterProductRequest): Promise<CampaignSlotProductResponse> {
        const response: ApiResponse<CampaignSlotProductResponse> = await request({
            url: `${SHOP_API}/campaigns/register`,
            method: 'POST',
            data: req,
            headers: {
                'Idempotency-Key': generateIdempotencyKey(),
            },
        });
        return response.data;
    }

    /**
     * Get available platform campaigns that shop can join
     */
    async getAvailablePlatformCampaigns(): Promise<CampaignResponse[]> {
        const response: ApiResponse<CampaignResponse[]> = await request({
            url: `${SHOP_API}/campaigns/available`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Get my registrations
     */
    async getMyRegistrations(page = 0, size = 10): Promise<PagedResponse<CampaignSlotProductResponse>> {
        const response: ApiResponse<PagedResponse<CampaignSlotProductResponse>> = await request({
            url: `${SHOP_API}/registrations`,
            method: 'GET',
            params: { page, size },
        });
        return response.data;
    }

    /**
     * Get my registrations in a specific campaign
     */
    async getMyRegistrationsInCampaign(campaignId: string): Promise<CampaignSlotProductResponse[]> {
        const response: ApiResponse<CampaignSlotProductResponse[]> = await request({
            url: `${SHOP_API}/registrations/campaign/${campaignId}`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Cancel my registration
     */
    async cancelRegistration(registrationId: string): Promise<void> {
        await request({
            url: `${SHOP_API}/registrations/${registrationId}`,
            method: 'DELETE',
        });
    }

    // ============================================================
    // SHOP'S OWN CAMPAIGNS (SHOP_SALE)
    // ============================================================

    /**
     * Create my own sale campaign
     */
    async createShopCampaign(req: CreateShopCampaignRequest): Promise<CampaignResponse> {
        const response: ApiResponse<CampaignResponse> = await request({
            url: `${SHOP_API}/sales`,
            method: 'POST',
            data: req,
            headers: {
                'Idempotency-Key': generateIdempotencyKey(),
            },
        });
        return response.data;
    }

    /**
     * Get my campaigns
     */
    async getMyCampaigns(page = 0, size = 10): Promise<PagedResponse<CampaignResponse>> {
        const response: ApiResponse<PagedResponse<CampaignResponse>> = await request({
            url: `${SHOP_API}/sales`,
            method: 'GET',
            params: { page, size },
        });
        return response.data;
    }

    /**
     * Get my campaign detail
     */
    async getMyCampaignDetail(campaignId: string): Promise<CampaignResponse> {
        const response: ApiResponse<CampaignResponse> = await request({
            url: `${SHOP_API}/sales/${campaignId}`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Update my campaign
     */
    async updateMyCampaign(campaignId: string, req: UpdateCampaignRequest): Promise<CampaignResponse> {
        const response: ApiResponse<CampaignResponse> = await request({
            url: `${SHOP_API}/sales/${campaignId}`,
            method: 'PUT',
            data: req,
        });
        return response.data;
    }

    /**
     * Schedule my campaign
     */
    async scheduleMyCampaign(campaignId: string): Promise<CampaignResponse> {
        const response: ApiResponse<CampaignResponse> = await request({
            url: `${SHOP_API}/sales/${campaignId}/schedule`,
            method: 'POST',
        });
        return response.data;
    }

    /**
     * Toggle my campaign (Pause/Resume)
     */
    async toggleShopCampaign(campaignId: string): Promise<CampaignResponse> {
        const response: ApiResponse<CampaignResponse> = await request({
            url: `${SHOP_API}/sales/${campaignId}/toggle`,
            method: 'POST',
        });
        return response.data;
    }

    /**
     * Cancel my campaign
     */
    async cancelMyCampaign(campaignId: string, reason: string): Promise<CampaignResponse> {
        const response: ApiResponse<CampaignResponse> = await request({
            url: `${SHOP_API}/sales/${campaignId}/cancel`,
            method: 'POST',
            data: { reason },
        });
        return response.data;
    }

    /**
     * Delete my campaign
     */
    async deleteMyCampaign(campaignId: string): Promise<void> {
        await request({
            url: `${SHOP_API}/sales/${campaignId}`,
            method: 'DELETE',
        });
    }


    // ============================================================
    // PRODUCT SELECTION Helper
    // ============================================================

    /**
     * Get my products for selection
     */
    async getMyProducts(params: { page?: number; size?: number; keyword?: string; }): Promise<PagedResponse<ProductResponse>> {
        const response: ApiResponse<PagedResponse<ProductResponse>> = await request({
            url: `${USER_API}/products/search`,
            method: 'GET',
            params: {
                page: params.page || 0,
                size: params.size || 20,
                keyword: params.keyword,
                status: 'APPROVED', // Only approved products can be in campaign
            },
        });
        return response.data;
    }
}

export const shopCampaignService = new ShopCampaignService();
