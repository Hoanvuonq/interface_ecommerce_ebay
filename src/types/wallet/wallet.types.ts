/**
 * Wallet Types
 */

// Enums
export enum WalletStatus {
    ACTIVE = "ACTIVE",
    FROZEN = "FROZEN",
    CLOSED = "CLOSED",
}

export enum TransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    PAYMENT = "PAYMENT",
    REFUND = "REFUND",
    TRANSFER_IN = "TRANSFER_IN",
    TRANSFER_OUT = "TRANSFER_OUT",
    ADJUSTMENT_INCREASE = "ADJUSTMENT_INCREASE",
    ADJUSTMENT_DECREASE = "ADJUSTMENT_DECREASE",
}

export enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
}

export enum WithdrawalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
}

export enum ReferenceType {
    ORDER = "ORDER",
    PAYMENT = "PAYMENT",
    WITHDRAWAL_REQUEST = "WITHDRAWAL_REQUEST",
    REFUND = "REFUND",
    COMMISSION = "COMMISSION",
    ADJUSTMENT = "ADJUSTMENT",
    TRANSFER = "TRANSFER",
    VOUCHER = "VOUCHER",
}

export enum WalletType {
    SHOP = "SHOP",
    BUYER = "BUYER",
    PLATFORM = "PLATFORM",
}

// Response DTOs
export interface WalletResponse {
    id: string;
    userId: string;
    username: string;
    balance: number;
    temporaryBalance: number;
    totalDeposited: number;
    totalWithdrawn: number;
    status: WalletStatus;
    note?: string;
    type: WalletType;
    createdBy?: string;
    createdDate: string;
    lastModifiedBy?: string;
    lastModifiedDate: string;
    deleted: boolean;
    version: number;
    /**
     * Flag để bắt buộc đổi mật khẩu lần đầu
     * Khi wallet được tạo tự động (ví dụ: khi shop được approve), 
     * mật khẩu được generate ngẫu nhiên và flag này = true
     * User phải đổi mật khẩu khi lần đầu truy cập wallet
     */
    mustChangePassword?: boolean;
}

export interface WalletTransactionResponse {
    id: string;
    walletId: string;
    type: TransactionType;
    status: TransactionStatus;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    description?: string;
    referenceId?: string;
    referenceType?: ReferenceType;
    note?: string;
    createdBy?: string;
    createdDate: string;
    lastModifiedBy?: string;
    lastModifiedDate: string;
    deleted: boolean;
    version: number;
    walletDepositPayment?: WalletDepositResponse;
}

export interface WalletDepositResponse {
    transactionId: string;
    depositPaymentId: string;
    amount: number;
    status: string;
    paymentUrl: string;
    qrCode?: string;
    accountNumber?: string;
    accountName?: string;
    expiresAt: string;
    createdBy?: string;
    createdDate: string;
    lastModifiedBy?: string;
    lastModifiedDate: string;
    deleted: boolean;
    version: number;
}

export interface WalletWithdrawalResponse {
    id: string;
    walletId: string;
    amount: number;
    bankAccountId: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    status: WithdrawalStatus;
    reason?: string;
    approvedByUserId?: string;
    approvedByUsername?: string;
    approvedAt?: string;
    processedAt?: string;
    note?: string;
    createdDate: string;
    lastModifiedDate: string;
}

// Request DTOs
export interface CreateWalletRequest {
    password: string;
    confirmPassword: string;
    type: WalletType;
}

export interface WalletDepositRequest {
    amount: number;
    walletType: WalletType; // Bắt buộc để xác định đúng wallet khi user có nhiều roles
    description?: string;
    referenceId?: string;
    referenceType?: ReferenceType;
    idempotencyKey?: string;
}

export interface WalletWithdrawRequest {
    amount: number;
    password: string;
    description?: string;
    note?: string;
}

export interface WalletWithdrawalCreateRequest {
    amount: number;
    walletType: WalletType; // Bắt buộc để xác định đúng wallet khi user có nhiều roles
    password: string;
    note?: string;
    idempotencyKey?: string;
}

export interface WalletPaymentRequest {
    amount: number;
    referenceId: string; // Mã tham chiếu (order_id, voucher_id, v.v.)
    referenceType?: ReferenceType; // Loại tham chiếu (ORDER, PAYMENT, v.v.) - Mặc định ORDER
    password: string;
    description?: string;
    idempotencyKey?: string; // Tránh duplicate transactions
}

export interface WalletRefundRequest {
    amount: number;
    referenceId: string;
    referenceType: ReferenceType;
    description?: string;
}

export interface WalletTransferRequest {
    amount: number;
    recipientWalletId: string;
    password: string;
    description?: string;
}

export interface ChangeWalletPasswordRequest {
    /**
     * Mật khẩu hiện tại
     * Optional: Chỉ bắt buộc nếu:
     * - BUYER wallet (người mua tự tạo wallet, luôn phải nhập mật khẩu cũ)
     * - SHOP wallet nhưng mustChangePassword = false (đã đổi mật khẩu lần đầu rồi)
     * 
     * Không bắt buộc nếu:
     * - SHOP wallet và mustChangePassword = true (lần đầu đổi mật khẩu, vì mật khẩu được generate tự động)
     */
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ResetWalletPasswordRequest {
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

// Pagination
export interface PageDto<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

