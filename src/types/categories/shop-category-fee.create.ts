export interface CreateShopCategoryFeeRequest {
    shopId: string;
    categoryId: string;
    feeValue: number;
    percentage?: boolean;
    minAmount?: number;
    maxAmount?: number;
    effectiveFrom: string;
    effectiveTo: string;
    active?: boolean;
}


