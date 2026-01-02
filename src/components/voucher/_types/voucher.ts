
export interface VoucherOption {
    id: string;
    code: string;
    name?: string;
    description?: string;
    imageBasePath?: string | null;
    imageExtension?: string | null;
    discountAmount: number; 
    discountType: 'PERCENTAGE' | 'FIXED';
    minOrderValue: number; 
    maxDiscount?: number | null;
    maxUsage?: number;
    usedCount?: number;
    remainingCount?: number;
    remainingPercentage?: number;
    canSelect: boolean; 
    reason?: string | null;
    isValid?: boolean; 
    voucherScope?: 'SHOP_ORDER' | 'SHIPPING' | 'PRODUCT' | 'ORDER';
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
    onFetchVouchers?: () => Promise<GroupedVouchers | VoucherOption[] | undefined>;
    onApplyVoucherCode?: (code: string) => Promise<{ success: boolean; voucher?: VoucherOption; error?: string }>;
    appliedVouchers?: {
        order?: VoucherOption;
        shipping?: VoucherOption;
    };
    appliedVoucher?: VoucherOption; 
    title?: string;
    shopName?: string;
    isShopVoucher?: boolean;
    isPlatform?: boolean; 
}
export interface VoucherInputProps {
    shopId?: string;
    shopName?: string;
    title?: string; 
    onApplyVoucher?: (shopId: string, voucherCode: string) => Promise<boolean>;
    onSelectVoucher?: (voucher: { order?: VoucherOption; shipping?: VoucherOption }) => Promise<boolean>;
    
    appliedVouchers?: {
        order?: VoucherOption;
        shipping?: VoucherOption;
    };
    
    compact?: boolean;
    className?: string;
    forcePlatform?: boolean;

    context?: {
        totalAmount: number;
        shopId?: string;      
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
}