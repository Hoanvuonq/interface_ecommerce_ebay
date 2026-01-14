/**
 * Loyalty Types - TypeScript interfaces matching backend DTOs
 */

// ==================== Enums ====================

export type PointBatchStatus = 'ACTIVE' | 'USED_UP' | 'EXPIRED';
export type LoyaltyRuleType = 'FIXED' | 'PERCENT';

// ==================== Buyer DTOs ====================

/**
 * Single point batch info
 */
export interface UserShopPointDto {
    batchId: string;
    initialAmount: number;
    remainingAmount: number;
    earnedAt: string;
    expiryAt: string;
    status: PointBatchStatus;
    sourceOrderNumber?: string;
    daysUntilExpiry: number;
}

/**
 * Point balance response with batch details
 */
export interface PointBalanceResponse {
    totalAvailable: number;
    activeBatchCount: number;
    expiringPoints: number;
    batches: UserShopPointDto[];
    queriedAt: string;
}

/**
 * Simple points response
 */
export interface PointsResponse {
    shopId: string;
    availablePoints: number;
}

/**
 * Request to consume points
 */
export interface ConsumePointsRequest {
    shopId: string;
    amount: number;
    orderId: string;
}

/**
 * Response from consuming points
 */
export interface ConsumePointsResponse {
    consumedPoints: number;
    orderId: string;
}

// ==================== Shop DTOs ====================

/**
 * Shop loyalty policy response
 */
export interface LoyaltyPolicyResponse {
    shopId: string;
    enabled: boolean;
    ruleType: LoyaltyRuleType;
    ruleValue: number;
    expiryDays: number;
    maxPointPerOrder?: number;
    maxDiscountPercent?: number;
    createdDate?: string;
    lastModifiedDate?: string;
    description: string;
}

/**
 * Request to create/update policy
 */
export interface LoyaltyPolicyRequest {
    enabled: boolean;
    ruleType: LoyaltyRuleType;
    ruleValue: number;
    expiryDays: number;
    maxPointPerOrder?: number;
    maxDiscountPercent?: number;
}

// ==================== Product Promotion DTOs ====================

export type PromotionStatus = 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'DISABLED';

/**
 * Request to create/update product promotion
 */
export interface ProductLoyaltyPromotionRequest {
    productId: string;
    ruleType: LoyaltyRuleType;
    ruleValue: number;
    startDate: string; // ISO date string YYYY-MM-DD
    endDate: string;
    name?: string;
    maxPointPerItem?: number;
    enabled?: boolean;
}

/**
 * Request to bulk create promotions for multiple products
 */
export interface BulkPromotionRequest {
    productIds?: string[]; // null/empty = ALL products
    ruleType: LoyaltyRuleType;
    ruleValue: number;
    startDate: string;
    endDate: string;
    name?: string;
    maxPointPerItem?: number;
    enabled?: boolean;
}

/**
 * Response for product loyalty promotion
 */
export interface ProductLoyaltyPromotionResponse {
    id: string;
    productId: string;
    productName: string;
    productThumbnail?: string;
    ruleType: LoyaltyRuleType;
    ruleValue: number;
    startDate: string;
    endDate: string;
    enabled: boolean;
    name?: string;
    maxPointPerItem?: number;
    isActive: boolean;
    status: PromotionStatus;
    createdDate?: string;
    lastModifiedDate?: string;
}

// ==================== Shop Statistics DTOs ====================

/**
 * Response for shop loyalty statistics
 */
export interface ShopLoyaltyStatisticsResponse {
    totalPointsAwarded: number;
    totalPointsUsed: number;
    totalPointsAvailable: number;
    totalPointsExpired: number;
    totalCustomersWithPoints: number;
    activeBatchCount: number;
}

