/**
 * Voucher Service - API calls cho voucher trong cart
 */

import { request } from '@/utils/axios.customize';
import type { ApiResponse } from '@/api/_types/api.types';

const VOUCHER_API_BASE = '/v2/vouchers';

/**
 * VoucherTemplateResponse từ backend
 */
interface VoucherTemplateResponse {
    id: string;
    code: string;
    name?: string;
    description?: string;
    discountAmount?: number;
    discountValue?: number; // API trả về discountValue
    discountType?: 'PERCENTAGE' | 'FIXED' | 'FIXED_AMOUNT' | 'PERCENTAGE_AMOUNT';
    minOrderValue?: number;
    minOrderAmount?: number; // API trả về minOrderAmount
    maxDiscount?: number;
    voucherScope?: 'SHOP_ORDER' | 'SHIPPING' | 'PRODUCT' | 'ORDER';
    active?: boolean;
    maxUsage?: number;
    usedCount?: number;
    [key: string]: any;
}

/**
 * PlatformVoucherRecommendationsResponse từ backend
 */
interface VoucherRecommendationResult {
    voucher: VoucherTemplateResponse;
    applicable: boolean;
    reason?: string;
}

interface PlatformVoucherRecommendationsResponse {
    productOrderVouchers?: VoucherRecommendationResult[];
    shippingVouchers?: VoucherRecommendationResult[];
}

/**
 * VoucherOption interface cho frontend
 */
export interface VoucherOption {
    id: string;
    code: string;
    description?: string;
    imageBasePath?: string | null;
    imageExtension?: string | null;
    discountAmount?: number;
    discountType?: 'PERCENTAGE' | 'FIXED';
    minOrderValue?: number;
    maxDiscount?: number;
    isValid?: boolean;
    maxUsage?: number;
    usedCount?: number;
    remainingCount?: number;
    remainingPercentage?: number;
    canSelect?: boolean;
    reason?: string;
}

class VoucherService {
    /**
     * Map VoucherTemplateResponse sang VoucherOption
     */
    private mapToVoucherOption(voucher: VoucherTemplateResponse): VoucherOption {
        const maxUsage = voucher.maxUsage;
        const usedCount = voucher.usedCount ?? 0;
        const remainingCount = maxUsage !== undefined ? maxUsage - usedCount : undefined;
        const remainingPercentage = maxUsage !== undefined && maxUsage > 0
            ? Math.round(((maxUsage - usedCount) / maxUsage) * 100)
            : undefined;

        // Map discountValue -> discountAmount
        const discountAmount = voucher.discountAmount ?? voucher.discountValue;
        
        // Map discountType: FIXED_AMOUNT -> FIXED, PERCENTAGE_AMOUNT -> PERCENTAGE
        let discountType: 'PERCENTAGE' | 'FIXED' | undefined = voucher.discountType as any;
        if (voucher.discountType === 'FIXED_AMOUNT') {
            discountType = 'FIXED';
        } else if (voucher.discountType === 'PERCENTAGE_AMOUNT') {
            discountType = 'PERCENTAGE';
        }
        
        // Map minOrderAmount -> minOrderValue
        const minOrderValue = voucher.minOrderValue ?? voucher.minOrderAmount;
        
        // Map description: ưu tiên description, sau đó name
        const description = voucher.description || voucher.name;

        return {
            id: voucher.id,
            code: voucher.code,
            description: description,
            imageBasePath: voucher.imageBasePath,
            imageExtension: voucher.imageExtension,
            discountAmount: discountAmount,
            discountType: discountType,
            minOrderValue: minOrderValue,
            maxDiscount: voucher.maxDiscount,
            isValid: voucher.active ?? true,
            maxUsage: maxUsage,
            usedCount: usedCount,
            remainingCount: remainingCount,
            remainingPercentage: remainingPercentage,
            canSelect: (voucher.active ?? true) && (remainingCount === undefined || remainingCount > 0),
            reason: !voucher.active ? 'Voucher đã hết hạn' : 
                   (remainingCount !== undefined && remainingCount <= 0) ? 'Voucher đã hết' : undefined,
        };
    }

    private mapRecommendationResult(result: VoucherRecommendationResult): VoucherOption | null {
        if (!result || !result.voucher) {
            return null;
        }
        const option = this.mapToVoucherOption(result.voucher);
        option.canSelect = result.applicable && option.canSelect !== false;
        option.reason = result.reason || option.reason;
        return option;
    }

    /**
     * GET /api/v2/vouchers/recommend/by-shop?shopId={shopId}
     * Lấy danh sách voucher recommend cho shop cụ thể (dành cho buyer)
     * Note: API này có thể yêu cầu role SHOP, nhưng có thể dùng query param shopId
     */
    async getShopVouchersForBuyer(shopId: string): Promise<VoucherOption[]> {
        try {
            const response: ApiResponse<VoucherTemplateResponse[]> = await request({
                url: `${VOUCHER_API_BASE}/recommend/by-shop?shopId=${shopId}`,
                method: 'GET',
            });

            if (!response.success || !response.data) {
                return [];
            }

            return response.data.map(v => this.mapToVoucherOption(v));
        } catch (error) {
            console.error('Error fetching shop vouchers for buyer:', error);
            return [];
        }
    }

    /**
     * GET /api/v2/vouchers/recommend/by-platform
     * Lấy danh sách voucher platform (toàn sàn) - dành cho buyer
     * Trả về: { productOrderVouchers, shippingVouchers }
     */
    async getPlatformVouchers(): Promise<{
        productOrderVouchers: VoucherOption[];
        shippingVouchers: VoucherOption[];
    }> {
        try {
            const response: ApiResponse<PlatformVoucherRecommendationsResponse> = await request({
                url: `${VOUCHER_API_BASE}/recommend/by-platform`,
                method: 'GET',
            });

            if (!response.success || !response.data) {
                return {
                    productOrderVouchers: [],
                    shippingVouchers: [],
                };
            }

            const result = {
                productOrderVouchers: (response.data.productOrderVouchers || [])
                    .map(res => this.mapRecommendationResult(res))
                    .filter((item): item is VoucherOption => !!item),
                shippingVouchers: (response.data.shippingVouchers || [])
                    .map(res => this.mapRecommendationResult(res))
                    .filter((item): item is VoucherOption => !!item),
            };
            
            console.log('✅ Platform Vouchers Mapped:', {
                productOrderCount: result.productOrderVouchers.length,
                shippingCount: result.shippingVouchers.length,
                sample: result.productOrderVouchers[0] || result.shippingVouchers[0],
            });
            
            return result;
        } catch (error) {
            console.error('Error fetching platform vouchers:', error);
            return {
                productOrderVouchers: [],
                shippingVouchers: [],
            };
        }
    }

    /**
     * GET /api/v2/vouchers/recommend/by-platform
     * Lấy tất cả platform vouchers dưới dạng flat list (cho modal)
     */
    async getPlatformVouchersFlat(): Promise<VoucherOption[]> {
        try {
            const result = await this.getPlatformVouchers();
            return [
                ...result.productOrderVouchers,
                ...result.shippingVouchers,
            ];
        } catch (error) {
            console.error('Error fetching platform vouchers flat:', error);
            return [];
        }
    }

    /**
     * POST /api/v2/vouchers/recommend/by-shop (với context)
     * Lấy voucher shop với context validation - chỉ trả về voucher có thể áp dụng được
     */
    async getShopVouchersWithContext(params: {
        shopId: string;
        totalAmount: number;
        shopIds?: string[];
        productIds?: string[];
        shippingFee?: number;
        shippingMethod?: string;
        shippingProvince?: string;
        shippingDistrict?: string;
        shippingWard?: string;
        failedVoucherCodes?: string[];
        preferences?: {
            scopes?: string[];
            limit?: number;
        };
    }): Promise<VoucherOption[]> {
        try {
            const response: ApiResponse<VoucherRecommendationResult[]> = await request({
                url: `${VOUCHER_API_BASE}/recommend/by-shop`,
                method: 'POST',
                data: {
                    shopId: params.shopId,
                    totalAmount: params.totalAmount,
                    shopIds: params.shopIds,
                    productIds: params.productIds,
                    shippingFee: params.shippingFee,
                    shippingMethod: params.shippingMethod,
                    shippingProvince: params.shippingProvince,
                    shippingDistrict: params.shippingDistrict,
                    shippingWard: params.shippingWard,
                    failedVoucherCodes: params.failedVoucherCodes,
                    preferences: params.preferences,
                },
            });

            if (!response.success || !response.data) {
                return [];
            }

            return response.data
                .map(res => this.mapRecommendationResult(res))
                .filter((item): item is VoucherOption => !!item);
        } catch (error) {
            console.error('Error fetching shop vouchers with context:', error);
            return [];
        }
    }

    /**
     * POST /api/v2/vouchers/recommend/by-platform (với context)
     * Lấy voucher platform với context validation - chỉ trả về voucher có thể áp dụng được
     */
    async getPlatformVouchersWithContext(params: {
        buyerId?: string;
        totalAmount: number;
        shopIds?: string[];
        productIds?: string[];
        shippingFee?: number;
        shippingMethod?: string;
        shippingProvince?: string;
        shippingDistrict?: string;
        shippingWard?: string;
        failedVoucherCodes?: string[];
        preferences?: {
            scopes?: string[];
            limit?: number;
        };
    }): Promise<{
        productOrderVouchers: VoucherOption[];
        shippingVouchers: VoucherOption[];
    }> {
        try {
            const response: ApiResponse<PlatformVoucherRecommendationsResponse> = await request({
                url: `${VOUCHER_API_BASE}/recommend/by-platform`,
                method: 'POST',
                data: {
                    buyerId: params.buyerId,
                    totalAmount: params.totalAmount,
                    shopIds: params.shopIds,
                    productIds: params.productIds,
                    shippingFee: params.shippingFee,
                    shippingMethod: params.shippingMethod,
                    shippingProvince: params.shippingProvince,
                    shippingDistrict: params.shippingDistrict,
                    shippingWard: params.shippingWard,
                    failedVoucherCodes: params.failedVoucherCodes,
                    preferences: params.preferences,
                },
            });

            if (!response.success || !response.data) {
                return {
                    productOrderVouchers: [],
                    shippingVouchers: [],
                };
            }

            const result = {
                productOrderVouchers: (response.data.productOrderVouchers || [])
                    .map(res => this.mapRecommendationResult(res))
                    .filter((item): item is VoucherOption => !!item),
                shippingVouchers: (response.data.shippingVouchers || [])
                    .map(res => this.mapRecommendationResult(res))
                    .filter((item): item is VoucherOption => !!item),
            };
            
            console.log('✅ Platform Vouchers With Context Mapped:', {
                productOrderCount: result.productOrderVouchers.length,
                shippingCount: result.shippingVouchers.length,
            });
            
            return result;
        } catch (error) {
            console.error('Error fetching platform vouchers with context:', error);
            return {
                productOrderVouchers: [],
                shippingVouchers: [],
            };
        }
    }
}

export const voucherService = new VoucherService();

