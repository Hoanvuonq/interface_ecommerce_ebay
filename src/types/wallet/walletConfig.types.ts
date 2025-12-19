/**
 * Types cho Wallet Withdrawal Config (Admin)
 */

export enum WalletType {
    BUYER = 'BUYER',
    SHOP = 'SHOP',
    PLATFORM = 'PLATFORM',
}

export enum SettlementWithdrawalRule {
    ONLY_ON_SETTLEMENT_DAY = 'ONLY_ON_SETTLEMENT_DAY', // Chỉ cho phép rút vào ngày settlement
    NEVER_ON_SETTLEMENT_DAY = 'NEVER_ON_SETTLEMENT_DAY', // Không bao giờ cho phép rút vào ngày settlement
    ANY_DAY = 'ANY_DAY', // Cho phép rút bất cứ lúc nào
}

/**
 * Request tạo/cập nhật cấu hình giới hạn rút tiền
 */
export interface WalletWithdrawalConfigRequest {
    walletId?: string; // Wallet ID cụ thể (nếu null thì áp dụng cho tất cả wallet có type tương ứng)
    walletType?: WalletType; // Wallet type (nếu walletId == null)
    dailyWithdrawalCountLimit?: number; // Số lần rút tối đa trong 1 ngày (0 = không giới hạn)
    dailyWithdrawalAmountLimit?: number; // Tổng số tiền rút tối đa trong 1 ngày (0 = không giới hạn)
    settlementDay?: number; // Ngày settlement cho shop (1-31, 0 = không có settlement)
    settlementWithdrawalRule?: SettlementWithdrawalRule; // Quy tắc rút tiền liên quan settlement
    note?: string; // Ghi chú
}

/**
 * Response cấu hình giới hạn rút tiền
 */
export interface WalletWithdrawalConfigResponse {
    id: string;
    walletId?: string;
    walletType?: WalletType;
    dailyWithdrawalCountLimit: number;
    dailyWithdrawalAmountLimit: number;
    settlementDay: number;
    settlementWithdrawalRule: SettlementWithdrawalRule;
    note?: string;
    createdDate: string;
    lastModifiedDate: string;
}

/**
 * Settlement rule labels
 */
export const SETTLEMENT_RULE_LABELS: Record<SettlementWithdrawalRule, string> = {
    [SettlementWithdrawalRule.ONLY_ON_SETTLEMENT_DAY]: 'Chỉ rút vào ngày thanh toán',
    [SettlementWithdrawalRule.NEVER_ON_SETTLEMENT_DAY]: 'Không rút vào ngày thanh toán',
    [SettlementWithdrawalRule.ANY_DAY]: 'Rút bất cứ ngày nào',
};

/**
 * Wallet type labels
 */
export const WALLET_TYPE_LABELS: Record<WalletType, string> = {
    [WalletType.BUYER]: 'Ví Người Mua',
    [WalletType.SHOP]: 'Ví Người Bán',
    [WalletType.PLATFORM]: 'Ví Sàn',
};
