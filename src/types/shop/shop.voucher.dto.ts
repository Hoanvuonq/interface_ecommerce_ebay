/* eslint-disable @typescript-eslint/no-explicit-any */

// ==================== ENUMS ====================

/**
 * Phương thức giảm giá
 */
export enum DiscountMethod {
  FIXED_AMOUNT = "FIXED_AMOUNT", // Giảm giá cố định
  PERCENTAGE = "PERCENTAGE", // Giảm theo phần trăm
}

/**
 * Loại người tạo voucher
 */
export enum CreatorType {
  PLATFORM = "PLATFORM",
  SHOP = "SHOP",
}

/**
 * Loại người trả phí
 */
export enum SponsorType {
  PLATFORM = "PLATFORM",
  SHOP = "SHOP",
}

/**
 * Loại owner của instance
 */
export enum OwnerType {
  PLATFORM = "PLATFORM",
  SHOP = "SHOP",
}

/**
 * Trạng thái instance
 */
export enum VoucherInstanceStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  EXHAUSTED = "EXHAUSTED",
}

/**
 * Loại transaction
 */
export enum TransactionType {
  PURCHASE = "PURCHASE", // Shop mua từ platform
  GRANT = "GRANT", // Platform cấp miễn phí
  SELF_CREATE = "SELF_CREATE", // Shop tự tạo
}

/**
 * Trạng thái thanh toán
 */
export enum PaymentStatus {
  PENDING = "PENDING",
  AWAITING_PAYMENT = "AWAITING_PAYMENT",
  PAID = "PAID",
  FAILED = "FAILED",
}

/**
 * Loại object áp dụng
 */
export enum ApplicableObjectType {
  SHOP = "SHOP",
  PRODUCT = "PRODUCT",
  CUSTOMER = "CUSTOMER",
  CATEGORY = "CATEGORY",
}

// ==================== VOUCHER TEMPLATE ====================

/**
 * Voucher Template - Định nghĩa quy tắc voucher
 */
export interface VoucherTemplate {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountMethod: DiscountMethod;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  creatorType: CreatorType;
  sponsorType: SponsorType;
  purchasable: boolean;
  price?: number;
  maxUsage: number;
  validityDays?: number;
  maxPurchasePerShop?: number;
  applyToAllShops: boolean;
  applyToAllProducts: boolean;
  applyToAllCustomers: boolean;
  shopIds?: string[];
  productIds?: string[];
  customerIds?: string[];
  active: boolean;
  metadata?: string;
  createdDate: string;
  lastModifiedDate: string;
}

/**
 * Request: Tạo voucher shop
 * POST /api/v2/vouchers/templates/shop
 */
export interface CreateShopVoucherRequest {
  code: string; // 6-64 ký tự
  name: string; // max 200
  description?: string; // max 1000
  discountMethod: DiscountMethod;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  maxUsage: number;
  applyToAllProducts: boolean;
  applyToAllCustomers: boolean;
  productIds?: string[];
  customerIds?: string[];
}

/**
 * Response: Tạo voucher shop thành công
 */
export interface CreateShopVoucherResponse {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountMethod: DiscountMethod;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  creatorType: CreatorType;
  sponsorType: SponsorType;
  purchasable: boolean;
  maxUsage: number;
  applyToAllShops: boolean;
  applyToAllProducts: boolean;
  applyToAllCustomers: boolean;
  active: boolean;
  createdDate: string;
  lastModifiedDate: string;
}

// ==================== VOUCHER INSTANCE ====================

/**
 * Voucher Instance - Kho giữ lượt sử dụng
 */
export interface VoucherInstance {
  id: string;
  templateId: string;
  ownerType: OwnerType;
  ownerId?: string;
  totalQuantity: number;
  usedQuantity: number;
  remainingQuantity?: number; // Computed field
  expiryDate: string;
  status: VoucherInstanceStatus;
  notes?: string;
  metadata?: string;
  createdDate: string;
  lastModifiedDate: string;
  version: number; // Optimistic Locking
}

// ==================== VOUCHER TRANSACTION ====================

/**
 * Voucher Transaction - Audit trail
 */
export interface VoucherTransaction {
  id: string;
  templateId: string;
  buyerShopId?: string;
  quantity: number;
  totalAmount: number;
  type: TransactionType;
  transactionDate: string;
  paymentStatus: PaymentStatus;
  paymentProvider?: string;
  paymentProviderId?: string;
  paymentMethod?: string;
  paymentReference?: string;
  currency: string;
  paymentInitiatedAt?: string;
  paymentCompletedAt?: string;
  paymentFailedAt?: string;
  failureCode?: string;
  failureMessage?: string;
  notes?: string;
  metadata?: string;
  createdDate: string;
  lastModifiedDate: string;
}

/**
 * Request: Shop mua voucher từ template
 * POST /api/v2/vouchers/purchase
 */
export interface PurchaseVoucherRequest {
  templateId: string;
}

/**
 * Response: Mua voucher thành công
 */
export interface PurchaseVoucherResponse {
  transactionId: string;
  templateId: string;
  buyerShopId: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  transactionDate: string;
  paymentUrl: string; // URL redirect để thanh toán
  paymentStatus: PaymentStatus;
  paymentProvider?: string;
  paymentMethod?: string;
  expiryDate: string;
  templateName: string;
  templateDescription?: string;
  status: string;
  message: string;
}

// ==================== VOUCHER INFO ====================

/**
 * Thông tin đầy đủ về voucher
 * GET /api/v2/vouchers/info/{templateId}
 */
export interface VoucherInfo {
  template: VoucherTemplate;
  instances: VoucherInstance[];
  isUsable: boolean;
  sourceOfTruth: string;
  reason?: string;
}

// ==================== SEARCH & VALIDATE ====================

/**
 * Request: Tìm kiếm voucher templates
 * GET /api/v2/vouchers/templates
 */
export interface SearchVoucherTemplatesRequest {
  scope?: "all" | "platform" | "shop" | "applicableForShop";
  q?: string; // Từ khóa tìm kiếm
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Response: Danh sách voucher templates (pageable)
 */
export interface SearchVoucherTemplatesResponse {
  content: VoucherTemplate[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

/**
 * Request: Validate multiple vouchers
 * POST /api/v2/vouchers/validate
 */
export interface ValidateVouchersRequest {
  voucherCodes: string[];
  shopId?: string;
}

/**
 * Voucher hợp lệ
 */
export interface ValidVoucher {
  code: string;
  templateId: string;
  discountValue: number;
  isUsable: boolean;
  sourceOfTruth: string;
}

/**
 * Voucher không hợp lệ
 */
export interface InvalidVoucher {
  code: string;
  reason: string;
}

/**
 * Response: Kết quả validate
 */
export interface ValidateVouchersResponse {
  validVouchers: ValidVoucher[];
  invalidVouchers: InvalidVoucher[];
  totalValid: number;
  totalInvalid: number;
}

// ==================== RECOMMEND ====================

/**
 * Response: Gợi ý voucher cho shop
 * GET /api/v2/vouchers/recommend/by-shop
 */
export type RecommendVouchersForShopResponse = VoucherTemplate[];

/**
 * Response: Gợi ý voucher platform
 * GET /api/v2/vouchers/recommend/by-platform
 */
export type RecommendPlatformVouchersResponse = VoucherTemplate[];

// ==================== USAGE ====================

/**
 * Response: Sử dụng voucher thành công
 * POST /api/v2/vouchers/use-instance/{instanceId}
 * POST /api/v2/vouchers/use-shop/{templateId}
 */
export type UseVoucherResponse = boolean;

/**
 * Response: Kiểm tra voucher có thể sử dụng
 * GET /api/v2/vouchers/check-usage/{templateId}
 */
export type CheckVoucherUsageResponse = boolean;




