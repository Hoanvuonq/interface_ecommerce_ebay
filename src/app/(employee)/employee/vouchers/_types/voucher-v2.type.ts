/**
 * Voucher V2 Types - Admin Module
 * Based on VOUCHER_V2_API_DOCUMENTATION.md
 */

// ==================== ENUMS ====================

/**
 * @deprecated Sử dụng VoucherScope và DiscountType thay thế
 */
export enum DiscountMethod {
    FIXED_AMOUNT = "FIXED_AMOUNT",
    PERCENTAGE = "PERCENTAGE",
    SHIPPING = "SHIPPING"
}

/**
 * Phạm vi áp dụng voucher: Trừ tiền vào đâu?
 * - SHOP_ORDER: Trừ vào tổng tiền hàng (Subtotal)
 * - SHIPPING: Trừ vào phí vận chuyển (Shipping Fee)
 * - PRODUCT: Trừ vào giá của từng sản phẩm cụ thể
 */
export enum VoucherScope {
    SHOP_ORDER = "SHOP_ORDER",
    SHIPPING = "SHIPPING",
    PRODUCT = "PRODUCT"
}

/**
 * Cách tính giảm giá: Trừ bao nhiêu?
 * - PERCENTAGE: Trừ theo phần trăm (%)
 * - FIXED_AMOUNT: Trừ một số tiền cố định (VND)
 */
export enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT"
}

export enum CreatorType {
    PLATFORM = "PLATFORM",
    SHOP = "SHOP"
}

export enum SponsorType {
    PLATFORM = "PLATFORM",
    SHOP = "SHOP"
}

export enum OwnerType {
    PLATFORM = "PLATFORM",
    SHOP = "SHOP"
}

export enum VoucherInstanceStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    EXHAUSTED = "EXHAUSTED"
}

export enum TransactionType {
    PURCHASE = "PURCHASE",
    GRANT = "GRANT",
    SELF_CREATE = "SELF_CREATE"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    AWAITING_PAYMENT = "AWAITING_PAYMENT",
    PAID = "PAID",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}

export enum ApplicableObjectType {
    SHOP = "SHOP",
    PRODUCT = "PRODUCT",
    CUSTOMER = "CUSTOMER",
    CATEGORY = "CATEGORY"
}

// ==================== ENTITIES ====================

/**
 * VoucherTemplate - Định nghĩa quy tắc voucher (Immutable sau khi publish)
 */
export interface VoucherTemplate {
    id : string;
    code : string;
    name : string;
    description?: string;
    imageBasePath?: string | null;
    imageExtension?: string | null;
    voucherScope : VoucherScope;
    discountType : DiscountType;
    discountValue : number;
    minOrderAmount?: number;
    maxDiscount?: number;
    startDate : string; // ISO 8601
    endDate : string; // ISO 8601
    creatorType : CreatorType;
    sponsorType : SponsorType;
    purchasable : boolean;
    price?: number;
    maxUsage?: number;
    validityDays?: number;
    maxPurchasePerShop?: number;
    applyToAllShops : boolean;
    applyToAllProducts : boolean;
    applyToAllCustomers : boolean;
    active : boolean;
    metadata?: string; // JSON string
    createdDate : string;
    lastModifiedDate : string;
}

/**
 * VoucherInstance - Kho (Pool) giữ lượt sử dụng - Source of Truth
 */
export interface VoucherInstance {
    id : string;
    templateId : string;
    ownerType : OwnerType;
    ownerId?: string; // null nếu platform-global
    totalQuantity : number;
    usedQuantity : number;
    remainingQuantity?: number; // Calculated: totalQuantity - usedQuantity
    expiryDate : string; // ISO 8601
    status : VoucherInstanceStatus;
    notes?: string;
    metadata?: string; // JSON string
    createdDate : string;
    lastModifiedDate : string;
    version : number; // Optimistic Locking
}

/**
 * VoucherTransaction - Nhật ký nguồn gốc của pool - Audit Trail
 */
export interface VoucherTransaction {
    id : string;
    templateId : string;
    buyerShopId?: string; // null nếu platform
    quantity : number;
    totalAmount : number;
    type : TransactionType;
    transactionDate : string;
    paymentStatus : PaymentStatus;
    paymentProvider?: string; // VNPAY, MOMO, STRIPE
    paymentProviderId?: string;
    paymentMethod?: string; // CREDIT_CARD, BANK_TRANSFER
    paymentReference?: string;
    currency : string; // Default: USD
    paymentInitiatedAt?: string;
    paymentCompletedAt?: string;
    paymentFailedAt?: string;
    failureCode?: string;
    failureMessage?: string;
    notes?: string;
    metadata?: string; // JSON string
    createdDate : string;
    lastModifiedDate : string;
}

/**
 * VoucherApplicableObject - Giới hạn phạm vi áp dụng
 */
export interface VoucherApplicableObject {
    id : string;
    templateId : string;
    objectType : ApplicableObjectType;
    objectId : string;
    createdDate : string;
    metadata?: string; // JSON string
}

// ==================== REQUEST DTOs ====================

/**
 * 1.1. Platform tạo Voucher Template (PAID hoặc FREE)
 */
export interface CreatePlatformTemplateRequest {
    code : string; // 6-64 ký tự, unique
    name : string; // max 200
    description?: string; // max 1000
    imageAssetId?: string;
    voucherScope : VoucherScope;
    discountType : DiscountType;
    discountValue : number;
    minOrderAmount?: number;
    maxDiscount?: number;
    startDate : string; // ISO 8601
    endDate : string; // ISO 8601
    purchasable : boolean; // PAID vs FREE
    price?: number; // Required if purchasable=true
    maxUsage?: number; // Required if purchasable=true
    validityDays?: number; // Required if purchasable=true
    maxPurchasePerShop?: number; // Required if purchasable=true
    applyToAllShops : boolean;
    applyToAllProducts : boolean;
    applyToAllCustomers : boolean;
    shopIds?: string[]; // If applyToAllShops=false
    productIds?: string[]; // If applyToAllProducts=false
    customerIds?: string[]; // If applyToAllCustomers=false
}

/**
 * 1.3. Platform tạo Voucher trực tiếp (sử dụng ngay)
 */
export interface CreatePlatformDirectRequest {
    code : string;
    name : string;
    description?: string;
    imageAssetId?: string;
    voucherScope : VoucherScope;
    discountType : DiscountType;
    discountValue : number;
    minOrderAmount?: number;
    maxDiscount?: number;
    startDate : string;
    endDate : string;
    maxUsage : number;
    applyToAllShops : boolean;
    applyToAllProducts : boolean;
    applyToAllCustomers : boolean;
    shopIds?: string[];
    productIds?: string[];
    customerIds?: string[];
}

/**
 * 2.5. Platform sử dụng Voucher trực tiếp
 */
export interface UsePlatformVoucherRequest {
    templateId : string;
}

/**
 * 2.3. Sử dụng Voucher từ Instance
 */
export interface UseInstanceRequest {
    instanceId : string;
}

/**
 * 3.2. Tìm kiếm Voucher Templates
 */
export interface SearchTemplatesRequest {
    scope?: "all" | "platform" | "shop" | "applicableForShop";
    q?: string; // Keyword search
    page?: number; // 0-based
    size?: number; // Default: 20
    sort?: string; // e.g. "createdDate,desc"
}

/**
 * 3.5. Validate Multiple Vouchers
 */
export interface ValidateVouchersRequest {
    voucherCodes : string[];
    shopId?: string;
}

// ==================== RESPONSE DTOs ====================

/**
 * Standard API Response
 */
export interface ApiResponseVoucher < T > {
    success: boolean;
    code: number;
    message: string;
    data: T;
    timestamp: string;
}

/**
 * Pageable Response
 */
export interface PageableResponse < T > {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    empty: boolean;
}

/**
 * VoucherInfo Response (GET /info/{templateId})
 */
export interface VoucherInfoResponse {
    template : VoucherTemplate;
    instances : VoucherInstance[];
    isUsable : boolean;
    sourceOfTruth : string; // "VOUCHER_INSTANCE"
    reason?: string;
}

/**
 * Validate Vouchers Response
 */
export interface ValidateVouchersResponse {
    validVouchers : {
        code: string;
        templateId: string;
        discountValue: number;
        isUsable: boolean;
        sourceOfTruth: string;
    }[];
    invalidVouchers : {
        code: string;
        reason: string;
    }[];
    totalValid : number;
    totalInvalid : number;
}

// ==================== FILTER & DISPLAY ====================

/**
 * Filter cho Template List
 */
export interface TemplateFilter {
    scope?: "all" | "platform" | "shop" | "applicableForShop";
    search?: string;
    voucherScope?: VoucherScope;
    discountType?: DiscountType;
    creatorType?: CreatorType;
    purchasable?: boolean;
    active?: boolean;
    startDate?: string;
    endDate?: string;
}

/**
 * Template với Instances (cho display)
 */
export interface TemplateWithInstances extends VoucherTemplate {
    instances?: VoucherInstance[];
    totalInstances?: number;
    totalUsed?: number;
    totalRemaining?: number;
    transactions?: VoucherTransaction[];
}

/**
 * Statistics Data
 */
export interface VoucherV2Statistics {
    totalTemplates : number;
    totalInstances : number;
    totalTransactions : number;
    totalRevenue : number;
    platformTemplates : number;
    shopTemplates : number;
    activeTemplates : number;
    expiredTemplates : number;
    exhaustedInstances : number;
    pendingTransactions : number;
    paidTransactions : number;
    failedTransactions : number;
}

// ==================== ADMIN SPECIFIC ====================

/**
 * Admin Template Detail (full info)
 */
export interface AdminTemplateDetail extends VoucherTemplate {
    instances : VoucherInstance[];
    transactions : VoucherTransaction[];
    applicableObjects : VoucherApplicableObject[];
    statistics : {
        totalPurchases: number;
        totalRevenue: number;
        totalUsage: number;
        shopsPurchased: number;
        averageUsagePerShop: number;
    };
}

/**
 * Delete Template Response
 */
export interface DeleteTemplateResponse {
    deletedTemplateId : string;
    deletedInstances : number;
    deletedTransactions : number;
    message : string;
}
