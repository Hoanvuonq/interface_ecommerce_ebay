/**
 * Buyer Service - API calls cho quản lý buyer
 */

import { request } from '@/utils/axios.customize';
import type {
    BuyerCreateRequest,
    BuyerUpdateRequest,
    BuyerResponse,
    BuyerDetailResponse,
} from '../types/buyer.types';
import type { ApiResponse } from '@/types/api.types';

const BUYER_API_BASE = '/v1/buyers';

class BuyerService {
    /**
     * Tạo thông tin buyer
     */
    async createBuyer(buyerCreateRequest: BuyerCreateRequest): Promise<BuyerResponse> {
        const response: ApiResponse<BuyerResponse> = await request({
            url: BUYER_API_BASE,
            method: 'POST',
            data: buyerCreateRequest,
        });
        return response.data;
    }

    /**
     * Cập nhật thông tin buyer
     */
    async updateBuyer(buyerId: string, buyerUpdateRequest: BuyerUpdateRequest): Promise<void> {
        await request({
            url: `${BUYER_API_BASE}/${buyerId}`,
            method: 'PUT',
            data: buyerUpdateRequest,
        });
    }

    /**
     * Lấy chi tiết thông tin buyer
     */
    async getBuyerDetail(buyerId: string): Promise<BuyerDetailResponse> {
        const response: ApiResponse<BuyerDetailResponse> = await request({
            url: `${BUYER_API_BASE}/${buyerId}`,
            method: 'GET',
        });
        return response.data;
    }
}

export const buyerService = new BuyerService();

