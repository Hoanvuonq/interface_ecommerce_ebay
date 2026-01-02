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
    isValid?: boolean; // active
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
    onFetchVouchers?: () => Promise<VoucherOption[] | GroupedVouchers>;
    onApplyVoucherCode?: (code: string) => Promise<{ success: boolean; voucher?: VoucherOption; error?: string }>;
    appliedVouchers?: { order?: VoucherOption; shipping?: VoucherOption };
    appliedVoucher?: VoucherOption; 
    title?: string;
    shopName?: string;
    isShopVoucher?: boolean;
    isPlatform?: boolean; 
}