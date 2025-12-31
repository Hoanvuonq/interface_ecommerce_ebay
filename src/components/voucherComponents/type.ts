
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
    maxUsage?: number;
    usedCount?: number;
    remainingCount?: number;
    remainingPercentage?: number;
    canSelect?: boolean;
    reason?: string;
}

export interface GroupedVouchers {
    productOrderVouchers: VoucherOption[];
    shippingVouchers: VoucherOption[];
}

export interface VoucherModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (selectedVouchers?: { order?: VoucherOption; shipping?: VoucherOption }) => void;
    vouchersData?: VoucherOption[] | GroupedVouchers;
    isLoading?: boolean;
    onFetchVouchers?: () => Promise<VoucherOption[] | GroupedVouchers>;
    onApplyVoucherCode?: (code: string) => Promise<{ success: boolean; voucher?: VoucherOption; error?: string }>;
    appliedVouchers?: {
        order?: VoucherOption;
        shipping?: VoucherOption;
    };
    appliedVoucher?: VoucherOption; 
    title?: string;
    shopName?: string;
    isShopVoucher?: boolean;
}

export interface VoucherInputProps {
    shopId?: string;
    shopName?: string;
    onApplyVoucher?: (shopId: string, voucherCode: string) => Promise<boolean>;
    onSelectVoucher?: (voucher: { order?: any; shipping?: any }) => Promise<boolean>;
    appliedVoucher?: {
        code: string;
        discount: number;
        description?: string;
    };
    appliedVouchers?: {
        order?: {
            code: string;
            discount: number;
            description?: string;
        };
        shipping?: {
            code: string;
            discount: number;
            description?: string;
        };
    };
    compact?: boolean;
    className?: string;
    context?: {
        totalAmount?: number;
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
    };
    forcePlatform?: boolean;
}