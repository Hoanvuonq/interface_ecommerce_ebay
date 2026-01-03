/**
 * Cart Types - Dựa trên backend DTOs
 */

export interface CartDto {
  id: string;
  buyerId: string;
  currency: string;
  totalAmount: number;
  totalDiscount: number;
  itemCount: number;
  createdDate: string;
  lastModifiedDate: string;
  version: number;
  shops: ShopDto[];
  shopCount: number;

  /** Warnings about cart changes (stock adjustments, removed items, price changes) */
  warnings?: string[];
  /** True if cart was modified during validation */
  hasChanges?: boolean;
}

export interface ShopDto {
  shopId: string;
  shopName: string;
  shopLogo?: string;
  ownerName?: string;
  isVerified?: boolean;
  rating?: number;
  items: CartItemDto[];
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  discount: number;
  total: number;
  allSelected: boolean;
  hasSelectedItems: boolean;
}

/** Stock status enum values */
export type StockStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "ADJUSTED"
  | "UNAVAILABLE";

export interface CartItemDto {
  id: string;
  cartId: string;
  variantId: string;
  version: number;
  productName: string;
  unitPrice: number;
  discountAmount: number;
  quantity: number;
  totalPrice: number;
  // Image properties
  imageBasePath?: string | null;
  imageExtension?: string | null;
  thumbnailUrl?: string; // Deprecated, use imageBasePath + imageExtension
  sku?: string;
  variantAttributes?: string;
  shopId?: string;
  shopName?: string;
  shopLogo?: string;
  productId?: string;
  selectedForCheckout?: boolean;
  stock?: number;
  attributes?: Record<string, string>;

  // ========== Stock Status Fields ==========
  /** Available stock for this variant */
  availableStock?: number;
  /** Stock status: IN_STOCK, LOW_STOCK, OUT_OF_STOCK, ADJUSTED, UNAVAILABLE */
  stockStatus?: StockStatus;
  /** Human-readable stock message */
  stockMessage?: string;
  /** Previous quantity before adjustment (if any) */
  previousQuantity?: number;
}

// Request Types
export interface AddToCartRequest {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface SelectItemsRequest {
  itemIds: string[];
}

export interface CartUpdateRequest {
  actionType: 1 | 2 | 3; // 1=select all, 2=update items, 3=deselect all
  itemUpdates?: ItemUpdate[];
}

export interface ItemUpdate {
  itemId: string;
  quantity?: number;
  selected?: boolean;
}

// Checkout Types
export interface OrderPreviewRequest {
  previewAllSelected?: boolean;
  allSelectedItemIds?: string[];
  shops?: ShopSelection[];
  shippingMethod?:
    | "STANDARD"
    | "EXPRESS"
    | "ECONOMY"
    | "GHN"
    | "CONKIN"
    | "SUPERSHIP";
  shippingAddress?: ShippingAddressInfo;
  loyaltyPoints?: number;
  paymentMethod?: string;
}

export interface ShopSelection {
  shopId: string;
  itemIds?: string[];
  vouchers?: string[];
  globalVouchers?: string[];
  shippingFee?: number;
  shippingMethodCode?: string;
  serviceCode?: number;
  shippingMethod?:
    | "STANDARD"
    | "EXPRESS"
    | "ECONOMY"
    | "GHN"
    | "CONKIN"
    | "SUPERSHIP";
}

export interface ShippingAddressInfo {
  addressId?: string;
  addressChanged?: boolean;
  country?: string;
  taxFee?: string;
  recipientName?: string; // ✅ Thêm trường này
  phoneNumber?: string; // ✅ Thêm trường này    state?: string;
  city?: string;
  postalCode?: string;
  addressLine1?: string;
  addressLine2?: string;
}

export interface OrderPreviewResponse {
  cartId: string;
  currency: string;
  previewAt: string;
  buyerAddressData?: BuyerAddressData;
  shops: ShopPreview[];
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  totalDiscount: number;
  // Discount breakdown by scope

  shippingDiscount?: number; // Giảm giá vận chuyển (SHIPPING scope)
  productDiscount?: number; // Giảm giá sản phẩm (PRODUCT scope)
  totalShippingFee: number;
  totalTaxAmount: number;
  grandTotal: number;
  globalVouchers?: VoucherInfo[];
  appliedCoupons?: CouponInfo[];
  voucherApplication?: VoucherApplicationResponse;
  loyaltyPointsInfo?: LoyaltyPointsInfo;
  isValid: boolean;
  validationErrors?: string[];
  warnings?: string[];
}

// --- New Checkout Types (2026 JSON structure) ---

export interface CheckoutSummary {
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  totalDiscount: number;
  shippingDiscount: number;
  productDiscount: number;
  totalShippingFee: number;
  totalTaxAmount: number;
  grandTotal: number;
}

export interface ShopVoucherResult2026 {
  shopId: string;
  validVouchers: string[];
  invalidVouchers: VoucherDiscountDetail[];
  totalDiscount: number;
  discountDetails: VoucherDiscountDetail[];
  hasValidVouchers: boolean;
}

export interface ShopLoyaltyInfo {
  availablePoints: number;
  pointsToRedeem: number;
  discountAmount: number;
  maxPointsAllowed: number;
  maxDiscountPercent?: number | null;
  expectedPointsEarned: number;
  canRedeem: boolean;
  message: string;
}

export interface ShopSummary {
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  productDiscount: number;
  shippingDiscount: number;
  totalDiscount: number;
  shippingFee: number;
  taxAmount: number;
  shopTotal: number;
}

export interface ShopPreview2026 {
  shopId: string;
  shopName: string;
  items: PreviewItem[];
  summary: ShopSummary;
  selectedShippingMethod: string;
  availableShippingOptions: Array<{
    serviceCode: number;
    serviceType: string;
    displayName: string;
    fee: number;
    estimatedDeliveryTime: string;
  }>;
  validationErrors: string[] | null;
  warnings: string[] | null;
  loyaltyInfo: ShopLoyaltyInfo;
  voucherResult: ShopVoucherResult2026;
}

export interface CheckoutPreview2026 {
  cartId: string;
  currency: string;
  previewAt: string;
  buyerAddressData: BuyerAddressData;
  shops: ShopPreview2026[];
  summary: CheckoutSummary;
  isValid: boolean;
  validationErrors: string[];
  warnings: string[];
}

// Alias for compatibility - CheckoutResponse is the new unified response
export type CheckoutResponse = OrderPreviewResponse | CheckoutPreview2026;

export interface BuyerAddressData {
  addressId?: string;
  addressType?: number; // 0 = Home, 1 = Office
  taxAddress?: string;
}

export interface VoucherApplicationResponse {
  success: boolean;
  globalVouchers?: GlobalVoucherResult;
  shopResults?: ShopVoucherResultBackend[];
  totalDiscount: number;

  shippingDiscountTotal?: number;
  productDiscountTotal?: number;
  errors?: string[];
  warnings?: string[];
}

export interface GlobalVoucherResult {
  validVouchers?: string[];
  invalidVouchers?: VoucherDiscountDetail[];
  totalDiscount?: number;
  discountDetails?: VoucherDiscountDetail[];
}

export interface ShopVoucherResultBackend {
  shopId: string;
  validVouchers?: string[];
  invalidVouchers?: VoucherDiscountDetail[];
  totalDiscount?: number;
  discountDetails?: VoucherDiscountDetail[];
  hasValidVouchers?: boolean;
}

export interface VoucherDiscountDetail {
  voucherCode: string;
  voucherType?: string;
  discountAmount: number;
  discountMethod?: "FIXED_AMOUNT" | "PERCENTAGE";
  discountTarget?: "SHIP" | "ORDER" | "PRODUCT";
  valid?: boolean;
  reason?: string;
}

// Legacy types kept for backward compatibility
export interface VoucherApplyResult {
  voucherId: string;
  voucherCode: string;
  discountAmount: number;
  discountTarget: "SHIP" | "ORDER" | "PRODUCT";
  applied: boolean;
  message?: string;
}

export interface ShopVoucherResult {
  shopId: string;
  voucherResults: VoucherApplyResult[];
}

export interface DiscountDetail {
  voucherId: string;
  voucherCode: string;
  discountAmount: number;
  discountTarget: "SHIP" | "ORDER" | "PRODUCT";
}

export interface ShopPreview {
  shopId: string;
  shopName: string;
  items: PreviewItem[];
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  taxAmount: number;
  shopTotal: number;
  appliedVouchers?: VoucherInfo[];
  appliedDiscounts?: DiscountInfo[];
  shippingInfo?: ShippingInfo;
  selectedShippingMethod?: string;
  availableShippingOptions?: ShippingOption[];
  validationErrors?: string[];
  warnings?: string[];
}

export interface PreviewItem {
  itemId: string;
  productId: string;
  variantId: string;
  productName: string;
  sku?: string;
  thumbnailUrl?: string;
  basePath?: string | null;
  extension?: string | null;
  variantAttributes?: string;
  unitPrice: number;
  quantity: number;
  discountAmount: number;
  lineTotal: number;
  isAvailable: boolean;
  availabilityMessage?: string;
  // Dimensions for shipping calculation
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightGrams?: number;
}

export interface ShippingInfo {
  method: string;
  fee: number;
  estimatedDays?: number;
  description?: string;
}

export interface ShippingOption {
  code: string;
  providerName: string;
  methodName: string;
  fee: number;
  originalFee?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  estimatedDeliveryText?: string;
  isSelected?: boolean;
  isRecommended?: boolean;
  providerLogoUrl?: string;
}

export interface DiscountInfo {
  code: string;
  type: string;
  amount: number;
  description?: string;
}

export interface VoucherInfo {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  discountAmount: number;
  description?: string;
  isValid?: boolean;
  validationMessage?: string;
}

export interface CouponInfo {
  code: string;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  discountAmount: number;
  description?: string;
  isValid?: boolean;
  validationMessage?: string;
}

export interface LoyaltyPointsInfo {
  pointsToRedeem: number;
  availablePoints: number;
  pointsValue: number;
  discountAmount: number;
  canRedeem: boolean;
  message?: string;
}

export interface CheckoutValidationErrorResponse {
  message: string;
  errors: string[];
  invalidItems?: string[];
}

// API Response wrapper
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}
