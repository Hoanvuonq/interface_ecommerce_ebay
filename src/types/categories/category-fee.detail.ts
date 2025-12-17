export interface CategoryFeeResponse {
    id: string;
    categoryId: string;
    categoryName?: string;
    feeValue: number;
    percentage: boolean;
    minAmount?: number;
    maxAmount?: number;
    effectiveFrom: string;
    effectiveTo?: string;
    active: boolean;
    
    // Audit fields
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    version: number;
}


