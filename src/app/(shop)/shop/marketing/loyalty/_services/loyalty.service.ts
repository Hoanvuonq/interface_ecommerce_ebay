/**
 * Loyalty Service - API calls for loyalty points
 * Follows existing pattern from checkout.service.ts
 */

import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";
import type {
  PointBalanceResponse,
  PointsResponse,
  ConsumePointsRequest,
  ConsumePointsResponse,
  LoyaltyPolicyRequest,
  LoyaltyPolicyResponse,
  UserShopPointDto,
  ProductLoyaltyPromotionRequest,
  ProductLoyaltyPromotionResponse,
  BulkPromotionRequest,
  ShopLoyaltyStatisticsResponse,
} from "../_types/loyalty.types";

const BUYER_API = "/v1/buyer/loyalty";
const SHOP_API = "/v1/shop/loyalty";
const SHOP_PRODUCT_API = "/v1/shop/loyalty/products";

class LoyaltyService {
  // ==================== Buyer APIs ====================

  /**
   * Get available points at a shop
   * GET /api/v1/buyer/loyalty/points/{shopId}
   */
  async getPoints(shopId: string): Promise<PointsResponse> {
    const response: ApiResponse<PointsResponse> = await request({
      url: `${BUYER_API}/points/${shopId}`,
      method: "GET",
    });
    return response.data;
  }

  /**
   * Get point balance with batch details
   * GET /api/v1/buyer/loyalty/points/{shopId}/details
   */
  async getPointBalance(shopId: string): Promise<PointBalanceResponse> {
    const response: ApiResponse<PointBalanceResponse> = await request({
      url: `${BUYER_API}/points/${shopId}/details`,
      method: "GET",
    });
    return response.data;
  }

  /**
   * Get list of active point batches
   * GET /api/v1/buyer/loyalty/points/{shopId}/batches
   */
  async getPointBatches(shopId: string): Promise<UserShopPointDto[]> {
    const response: ApiResponse<UserShopPointDto[]> = await request({
      url: `${BUYER_API}/points/${shopId}/batches`,
      method: "GET",
    });
    return response.data;
  }

  /**
   * Consume points for order discount
   * POST /api/v1/buyer/loyalty/points/consume
   */
  async consumePoints(
    payload: ConsumePointsRequest
  ): Promise<ConsumePointsResponse> {
    const response: ApiResponse<ConsumePointsResponse> = await request({
      url: `${BUYER_API}/points/consume`,
      method: "POST",
      data: payload,
    });
    return response.data;
  }

  // ==================== Shop Policy APIs ====================

  /**
   * Get shop loyalty policy
   * GET /api/v1/shop/loyalty/policy
   */
  async getPolicy(): Promise<LoyaltyPolicyResponse | null> {
    const response: ApiResponse<LoyaltyPolicyResponse | null> = await request({
      url: `${SHOP_API}/policy`,
      method: "GET",
    });
    return response.data;
  }

  /**
   * Create shop loyalty policy
   * POST /api/v1/shop/loyalty/policy
   */
  async createPolicy(
    payload: LoyaltyPolicyRequest
  ): Promise<LoyaltyPolicyResponse> {
    const response: ApiResponse<LoyaltyPolicyResponse> = await request({
      url: `${SHOP_API}/policy`,
      method: "POST",
      data: payload,
    });
    return response.data;
  }

  /**
   * Update shop loyalty policy
   * PUT /api/v1/shop/loyalty/policy
   */
  async updatePolicy(
    payload: LoyaltyPolicyRequest
  ): Promise<LoyaltyPolicyResponse> {
    const response: ApiResponse<LoyaltyPolicyResponse> = await request({
      url: `${SHOP_API}/policy`,
      method: "PUT",
      data: payload,
    });
    return response.data;
  }

  /**
   * Toggle shop loyalty policy on/off
   * PATCH /api/v1/shop/loyalty/policy/toggle
   */
  async togglePolicy(): Promise<LoyaltyPolicyResponse> {
    const response: ApiResponse<LoyaltyPolicyResponse> = await request({
      url: `${SHOP_API}/policy/toggle`,
      method: "PATCH",
    });
    return response.data;
  }

  // ==================== Shop Product Loyalty APIs ====================

  /**
   * Get all product loyalty promotions
   * GET /api/v1/shop/loyalty/products
   */
  async getPromotions(): Promise<ProductLoyaltyPromotionResponse[]> {
    const response: ApiResponse<ProductLoyaltyPromotionResponse[]> =
      await request({
        url: SHOP_PRODUCT_API,
        method: "GET",
      });
    return response.data;
  }

  /**
   * Create product loyalty promotion
   * POST /api/v1/shop/loyalty/products
   */
  async createPromotion(
    payload: ProductLoyaltyPromotionRequest
  ): Promise<ProductLoyaltyPromotionResponse> {
    const response: ApiResponse<ProductLoyaltyPromotionResponse> =
      await request({
        url: SHOP_PRODUCT_API,
        method: "POST",
        data: payload,
      });
    return response.data;
  }

  /**
   * Bulk create promotions for multiple products
   * POST /api/v1/shop/loyalty/products/bulk
   */
  async bulkCreatePromotions(
    payload: BulkPromotionRequest
  ): Promise<ProductLoyaltyPromotionResponse[]> {
    const response: ApiResponse<ProductLoyaltyPromotionResponse[]> =
      await request({
        url: `${SHOP_PRODUCT_API}/bulk`,
        method: "POST",
        data: payload,
      });
    return response.data;
  }

  /**
   * Update product loyalty promotion
   * PUT /api/v1/shop/loyalty/products/{promotionId}
   */
  async updatePromotion(
    promotionId: string,
    payload: ProductLoyaltyPromotionRequest
  ): Promise<ProductLoyaltyPromotionResponse> {
    const response: ApiResponse<ProductLoyaltyPromotionResponse> =
      await request({
        url: `${SHOP_PRODUCT_API}/${promotionId}`,
        method: "PUT",
        data: payload,
      });
    return response.data;
  }

  /**
   * Toggle promotion on/off
   * PATCH /api/v1/shop/loyalty/products/{promotionId}/toggle
   */
  async togglePromotion(
    promotionId: string
  ): Promise<ProductLoyaltyPromotionResponse> {
    const response: ApiResponse<ProductLoyaltyPromotionResponse> =
      await request({
        url: `${SHOP_PRODUCT_API}/${promotionId}/toggle`,
        method: "PATCH",
      });
    return response.data;
  }

  /**
   * Delete product loyalty promotion
   * DELETE /api/v1/shop/loyalty/products/{promotionId}
   */
  async deletePromotion(promotionId: string): Promise<void> {
    await request({
      url: `${SHOP_PRODUCT_API}/${promotionId}`,
      method: "DELETE",
    });
  }

  // ==================== Shop Statistics APIs ====================

  /**
   * Get shop loyalty statistics
   * GET /api/v1/shop/loyalty/statistics
   */
  async getStatistics(): Promise<ShopLoyaltyStatisticsResponse> {
    const response: ApiResponse<ShopLoyaltyStatisticsResponse> = await request({
      url: `${SHOP_API}/statistics`,
      method: "GET",
    });
    return response.data;
  }
}

export const loyaltyService = new LoyaltyService();
