export interface ShopCategoryFeeResponse {
    id: string;
    shopId: string;
    shopName?: string;
    categoryId: string;
    categoryName?: string;
    feeValue: number;
    percentage: boolean;
    minAmount?: number;
    maxAmount?: number;
    effectiveFrom: string;
    effectiveTo: string;
    active: boolean;
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    version: number;
}


