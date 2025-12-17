export type AdminApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminProductCategoryDTO {
    id: string;
    name: string;
}

export interface AdminProductListItemDTO {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    active: boolean;
    approvalStatus: AdminApprovalStatus;
    category: AdminProductCategoryDTO;
    createdBy?: string;
    createdDate: string;
    version: number;
}

export interface AdminApproveResponseDTO {
    id: string;
    name: string;
    approvalStatus: Extract<AdminApprovalStatus, 'APPROVED'>;
    approvedBy: string;
    approvedAt: string;
    version: number;
}

export interface AdminRejectRequestDTO {
    reason: string;
}

export interface AdminRejectResponseDTO {
    id: string;
    name: string;
    approvalStatus: Extract<AdminApprovalStatus, 'REJECTED'>;
    rejectedBy: string;
    rejectedAt: string;
    rejectionReason: string;
    version: number;
}

export interface AdminToggleActiveRequestDTO {
    active: boolean;
}

export interface AdminToggleActiveResponseDTO {
    id: string;
    name: string;
    active: boolean;
    version: number;
}

export interface AdminProductStatisticsDTO {
    totalProducts: number;
    draftProducts: number;
    pendingProducts: number;
    approvedProducts: number;
    rejectedProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    deletedProducts: number;
    productsByCategory: Record<string, number>;
    productsByUser: Record<string, number>;
}

export interface AdminApprovalStatsDTO {
    approvalStats: {
        totalPending: number;
        approvedToday: number;
        rejectedToday: number;
        averageApprovalTime: string;
        approvalRate: number;
    };
    recentActivity: Array<{
        productId: string;
        productName: string;
        action: 'APPROVED' | 'REJECTED' | 'PENDING';
        adminId: string;
        timestamp: string;
    }>;
}

