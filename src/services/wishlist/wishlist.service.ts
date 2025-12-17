/**
 * Wishlist Service - API calls cho wishlist
 */

import { request } from '@/utils/axios.customize';

import { WishlistResponse,
    WishlistSummaryResponse,
    WishlistItemResponse,
    CreateWishlistRequest,
    UpdateWishlistRequest,
    AddToWishlistRequest,
    UpdateWishlistItemRequest,
    WishlistQueryParams,
    SearchWishlistParams,
    PriceTargetMetResponse,
    WishlistOgMetadata, } from '@/types/wishlist/wishlist.types';
import type { ApiResponse } from '@/api/_types/api.types';
import type { PageableResponse } from '@/api/_types/api.types';

const WISHLIST_API_BASE = '/v1/wishlists';

class WishlistService {
    // ========== Wishlist Management ==========

    /**
     * Tạo wishlist mới
     */
    async createWishlist(requestData: CreateWishlistRequest): Promise<WishlistResponse> {
        const response: ApiResponse<WishlistResponse> = await request({
            url: WISHLIST_API_BASE,
            method: 'POST',
            data: requestData,
        });
        return response.data;
    }

    /**
     * Cập nhật wishlist
     */
    async updateWishlist(wishlistId: string, requestData: UpdateWishlistRequest): Promise<WishlistResponse> {
        const response: ApiResponse<WishlistResponse> = await request({
            url: `${WISHLIST_API_BASE}/${wishlistId}`,
            method: 'PUT',
            data: requestData,
        });
        return response.data;
    }

    /**
     * Xóa wishlist
     */
    async deleteWishlist(wishlistId: string): Promise<void> {
        await request({
            url: `${WISHLIST_API_BASE}/${wishlistId}`,
            method: 'DELETE',
        });
    }

    /**
     * Lấy wishlist theo ID
     */
    async getWishlistById(wishlistId: string): Promise<WishlistResponse> {
        const response: ApiResponse<WishlistResponse> = await request({
            url: `${WISHLIST_API_BASE}/${wishlistId}`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Lấy wishlist công khai theo ID
     */
    async getPublicWishlistById(wishlistId: string): Promise<WishlistResponse> {
        const response: ApiResponse<WishlistResponse> = await request({
            url: `${WISHLIST_API_BASE}/public/${wishlistId}`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Lấy danh sách wishlist của buyer
     */
    async getBuyerWishlists(params?: WishlistQueryParams): Promise<PageableResponse<WishlistSummaryResponse>> {
        const response: ApiResponse<PageableResponse<WishlistSummaryResponse>> = await request({
            url: WISHLIST_API_BASE,
            method: 'GET',
            params: {
                page: params?.page || 0,
                size: params?.size || 10,
                sortBy: params?.sortBy || 'createdDate',
                sortDir: params?.sortDir || 'desc',
            },
        });
        return response.data;
    }

    /**
     * Lấy danh sách wishlist công khai
     */
    async getPublicWishlists(params?: WishlistQueryParams): Promise<PageableResponse<WishlistSummaryResponse>> {
        const response: ApiResponse<PageableResponse<WishlistSummaryResponse>> = await request({
            url: `${WISHLIST_API_BASE}/public`,
            method: 'GET',
            params: {
                page: params?.page || 0,
                size: params?.size || 10,
                sortBy: params?.sortBy || 'createdDate',
                sortDir: params?.sortDir || 'desc',
            },
        });
        return response.data;
    }

    /**
     * Tìm kiếm wishlist của buyer
     */
    async searchBuyerWishlists(params: SearchWishlistParams): Promise<PageableResponse<WishlistSummaryResponse>> {
        const response: ApiResponse<PageableResponse<WishlistSummaryResponse>> = await request({
            url: `${WISHLIST_API_BASE}/search`,
            method: 'GET',
            params: {
                keyword: params.keyword,
                page: params.page || 0,
                size: params.size || 10,
            },
        });
        return response.data;
    }

    /**
     * Tìm kiếm wishlist công khai
     */
    async searchPublicWishlists(params: SearchWishlistParams): Promise<PageableResponse<WishlistSummaryResponse>> {
        const response: ApiResponse<PageableResponse<WishlistSummaryResponse>> = await request({
            url: `${WISHLIST_API_BASE}/public/search`,
            method: 'GET',
            params: {
                keyword: params.keyword,
                page: params.page || 0,
                size: params.size || 10,
            },
        });
        return response.data;
    }

    /**
     * Lấy wishlist mặc định của user
     */
    async getDefaultWishlist(): Promise<WishlistResponse> {
        const response: ApiResponse<WishlistResponse> = await request({
            url: `${WISHLIST_API_BASE}/default`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Đặt wishlist làm mặc định
     */
    async setAsDefault(wishlistId: string): Promise<WishlistResponse> {
        const response: ApiResponse<WishlistResponse> = await request({
            url: `${WISHLIST_API_BASE}/${wishlistId}/set-default`,
            method: 'PUT',
        });
        return response.data;
    }

    // ========== Wishlist Items Management ==========

    /**
     * Thêm sản phẩm vào wishlist
     */
    async addToWishlist(wishlistId: string, requestData: AddToWishlistRequest): Promise<WishlistItemResponse> {
        const response: ApiResponse<WishlistItemResponse> = await request({
            url: `${WISHLIST_API_BASE}/${wishlistId}/items`,
            method: 'POST',
            data: requestData,
        });
        return response.data;
    }

    /**
     * Thêm sản phẩm vào wishlist mặc định
     */
    async addToDefaultWishlist(requestData: AddToWishlistRequest): Promise<WishlistItemResponse> {
        const response: ApiResponse<WishlistItemResponse> = await request({
            url: `${WISHLIST_API_BASE}/default/items`,
            method: 'POST',
            data: requestData,
        });
        return response.data;
    }

    /**
     * Cập nhật item trong wishlist
     */
    async updateWishlistItem(
        wishlistId: string,
        itemId: string,
        requestData: UpdateWishlistItemRequest
    ): Promise<WishlistItemResponse> {
        const response: ApiResponse<WishlistItemResponse> = await request({
            url: `${WISHLIST_API_BASE}/${wishlistId}/items/${itemId}`,
            method: 'PUT',
            data: requestData,
        });
        return response.data;
    }

    /**
     * Xóa sản phẩm khỏi wishlist
     */
    async removeFromWishlist(wishlistId: string, variantId: string): Promise<void> {
        await request({
            url: `${WISHLIST_API_BASE}/${wishlistId}/items/${variantId}`,
            method: 'DELETE',
        });
    }

    /**
     * Lấy danh sách item trong wishlist
     */
    async getWishlistItems(wishlistId: string): Promise<WishlistItemResponse[]> {
        const response: ApiResponse<WishlistItemResponse[]> = await request({
            url: `${WISHLIST_API_BASE}/${wishlistId}/items`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Kiểm tra sản phẩm có trong wishlist không
     * Sử dụng API check-variants với array có 1 phần tử
     */
    async isProductInWishlist(variantId: string): Promise<boolean> {
        const result = await this.checkVariantsInWishlist([variantId]);
        return result.get(variantId) || false;
    }

    /**
     * Lấy danh sách sản phẩm đạt giá mong muốn (được nhóm theo wishlist)
     */
    async getPriceTargetMetItems(): Promise<PriceTargetMetResponse> {
        const response: ApiResponse<PriceTargetMetResponse> = await request({
            url: `${WISHLIST_API_BASE}/price-target-met`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Kiểm tra nhiều variants có trong wishlist không
     * @param variantIds Danh sách variant IDs cần kiểm tra
     * @returns Map với key là variantId và value là boolean (true nếu có trong wishlist)
     */
    async checkVariantsInWishlist(variantIds: string[]): Promise<Map<string, boolean>> {
        if (variantIds.length === 0) {
            return new Map();
        }
        // Spring @RequestParam List<String> expects multiple params: ?variantIds=id1&variantIds=id2
        // Axios will automatically serialize array params correctly
        const response: ApiResponse<Record<string, boolean>> = await request({
            url: `${WISHLIST_API_BASE}/check-variants`,
            method: 'GET',
            params: { variantIds },
        });
        // Convert Record to Map
        const map = new Map<string, boolean>();
        Object.entries(response.data || {}).forEach(([key, value]) => {
            map.set(key, value);
        });
        return map;
    }

    // ========== Wishlist Sharing ==========

    /**
     * Lấy wishlist công khai theo share token
     * Public endpoint - không cần authentication
     */
    async getPublicWishlistByShareToken(shareToken: string): Promise<WishlistResponse> {
        const response: ApiResponse<WishlistResponse> = await request({
            url: `${WISHLIST_API_BASE}/shared/${shareToken}`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Regenerate share token cho wishlist
     */
    async regenerateShareToken(wishlistId: string): Promise<WishlistResponse> {
        const response: ApiResponse<WishlistResponse> = await request({
            url: `${WISHLIST_API_BASE}/${wishlistId}/regenerate-token`,
            method: 'POST',
        });
        return response.data;
    }


    /**
     * Lấy OG metadata cho wishlist share
     */
    async getOgMetadata(shareToken: string): Promise<WishlistOgMetadata> {
        const response: ApiResponse<WishlistOgMetadata> = await request({
            url: `${WISHLIST_API_BASE}/shared/${shareToken}/og`,
            method: 'GET',
        });
        return response.data;
    }
}

export const wishlistService = new WishlistService();

