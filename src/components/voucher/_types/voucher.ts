/** * 1. COMMON ENUMS & BASIC TYPES
 * Các định nghĩa dùng chung cho cả Request và Response
 */
export type VoucherScope = "SHOP_ORDER" | "SHIPPING" | "PRODUCT" | "ORDER";
export type DiscountType = "FIXED_AMOUNT" | "PERCENTAGE";
export type ActorType = "PLATFORM" | "SHOP";

/** * 2. CORE INTERFACE (SERVER MODEL)
 * Thực thể Voucher chuẩn từ Database/Server trả về
 */
export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  voucherScope: VoucherScope;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  active: boolean;
  creatorType?: ActorType;
  sponsorType?: ActorType;
  purchasable?: boolean;
  price?: number | null;
  maxUsage: number;
  // Metadata cho ảnh
  imagePath?: string | null;
  imageBasePath?: string;
  imageExtension?: string;
  // Quan hệ
  applyToAllShops?: boolean;
  shopIds?: string[] | null;
  productIds?: string[] | null;
  customerIds?: string[] | null;
}

/** * 3. API REQUEST PAYLOADS
 * Dữ liệu gửi lên Server để lấy danh sách khuyến mãi
 */
export interface VoucherItemPayload {
  productId: string;
  shopId: string; // Đã sửa từ shopIds[] thành shopId
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface VoucherRequestBase {
  totalAmount: number;
  items: VoucherItemPayload[];
  shippingFee?: number;
  shippingProvince?: string;
  shippingDistrict?: string;
  shippingWard?: string;
  cartId?: string;
  failedVoucherCodes?: string[];
  shopId?: string; // Thêm vào base để linh hoạt
  shopIds?: string[]; // Dùng cho platform
  productIds?: string[]; // Dùng cho platform
  preferences?: {
    scopes: VoucherScope[];
    limit: number;
  };
}

export interface VoucherShopRequest extends VoucherRequestBase {
  shopId: string; // Bắt buộc khi gọi cho Shop
}

export interface VoucherPlatformRequest extends VoucherRequestBase {
  shopIds: string[];
  productIds: string[];
}

/** * 4. API RESPONSE WRAPPERS
 * Cấu trúc dữ liệu Server trả về
 */
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface VoucherRecommendationResult {
  voucher: Voucher;
  applicable: boolean;
  reason: string | null;
  calculatedDiscount: number;
}

export interface PlatformVoucherRecommendationsData {
  productOrderVouchers: VoucherRecommendationResult[];
  shippingVouchers: VoucherRecommendationResult[];
}

/** * 5. UI MODELS (FLATTENED)
 * Dữ liệu đã qua xử lý (map) để hiển thị trên Giao diện
 */
export interface VoucherOption extends Voucher {
  applicable: boolean;
  reason: string | null;
  calculatedDiscount: number;

  // Các field alias để UI cũ/mới đều dùng được (Sử dụng mapping trong Service)
  discount: number; // Thường là calculatedDiscount
  discountAmount: number; // Thường là discountValue
  minOrderValue: number; // Thường là minOrderAmount
  discountMethod: DiscountType;
  voucherType: VoucherScope;
  canSelect: boolean;
  isValid?: boolean;
}

export interface GroupedVouchers {
  productOrderVouchers: VoucherOption[];
  shippingVouchers: VoucherOption[];
}

export interface VoucherSelection {
  order?: VoucherOption;
  shipping?: VoucherOption;
}

/** * 6. COMPONENT PROPS
 */
export interface VoucherInputProps {
  shopId?: string; // Sửa từ shopIds thành shopId
  context?: VoucherRequestBase;
  shopName?: string;
  className?: string;
  compact?: boolean;
  onSelectVoucher?: (selection: VoucherSelection) => Promise<boolean>;
  onApplyVoucher?: (shopId: string, code: string) => Promise<boolean>; // Thêm prop này nếu chưa có
  appliedVouchers?: VoucherSelection;
  forcePlatform?: boolean;
}

export interface VoucherModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: VoucherSelection) => void | Promise<void>;
  
  // Các trường định danh
  shopId?: string;       // Dùng shopId (số ít) cho đồng bộ
  shopName?: string;
  isPlatform?: boolean;
  title?: string | React.ReactNode;

  // Dữ liệu và trạng thái
  vouchersData?: VoucherOption[] | GroupedVouchers;
  isLoading?: boolean;
  appliedVouchers?: VoucherSelection;

  // Trường đang gây lỗi TS(2353)
  previewData?: any;     // <--- THÊM DÒNG NÀY VÀO ĐÂY

  // Các callback khác
  onFetchVouchers?: () => Promise<GroupedVouchers | VoucherOption[] | undefined>;
  onApplyVoucherCode?: (
    code: string,
  ) => Promise<{ success: boolean; voucher?: VoucherOption; error?: string }>;
}