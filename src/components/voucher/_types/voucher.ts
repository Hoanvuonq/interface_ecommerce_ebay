/**
 * 1. TRƯỜNG DỮ LIỆU GỐC CỦA VOUCHER (Domain Model)
 * Gom từ VoucherTemplateResponse và VoucherOption
 */
export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  voucherScope: "SHOP_ORDER" | "SHIPPING" | "PRODUCT" | "ORDER";
  discountType: "FIXED_AMOUNT" | "PERCENTAGE";
  discountValue: number; // Số tiền hoặc % giảm
  minOrderAmount: number; // Giá trị đơn tối thiểu
  maxDiscount: number | null; // Giảm tối đa (cho loại PERCENTAGE)

  startDate: string;
  endDate: string;
  active: boolean; // Trạng thái từ server
  maxUsage: number;

  imageBasePath: string | null;
  imageExtension: string | null;

  // Metadata thêm nếu cần dùng
  creatorType?: "PLATFORM" | "SHOP";
  sponsorType?: "PLATFORM" | "SHOP";
}

/**
 * 2. DỮ LIỆU TRẢ VỀ TỪ API RECOMMENDATION
 * (Bao gồm voucher và kết quả tính toán cho đơn hàng hiện tại)
 */
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

/**
 * 3. INTERFACE DÙNG CHO UI (VoucherOption)
 * Phẳng hóa dữ liệu để Component dễ đọc, không phải gọi .voucher.code
 */
export interface VoucherOption extends Omit<Voucher, "active"> {
  discountAmount: number;
  minOrderValue: number;
  calculatedDiscount: number;
  voucherType?: "SHOP_ORDER" | "SHIPPING" | "PRODUCT" | "ORDER";
  discountMethod: "FIXED_AMOUNT" | "PERCENTAGE";
  applicable: boolean;
  canSelect: boolean;
  reason: string | null;
  isValid: boolean;
}
/**
 * 4. CÁC KIỂU DỮ LIỆU PHỤ TRỢ CHO COMPONENT
 */
export interface GroupedVouchers {
  productOrderVouchers: VoucherOption[];
  shippingVouchers: VoucherOption[];
}

export interface VoucherSelection {
  order?: VoucherOption;
  shipping?: VoucherOption;
}

// Props cho Modal
export interface VoucherModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: (selected: VoucherSelection) => void;
  onFetchVouchers?: () => Promise<
    GroupedVouchers | VoucherOption[] | undefined
  >;
  vouchersData?: VoucherOption[] | GroupedVouchers;
  isLoading?: boolean;
  onApplyVoucherCode?: (
    code: string
  ) => Promise<{ success: boolean; voucher?: VoucherOption; error?: string }>;
  appliedVouchers?: VoucherSelection;
  isPlatform?: boolean;
  shopName?: string;
  previewData?: any;
  shopId?: string;
}

export interface VoucherInputProps {
  shopId?: string;
  context?: {
    totalAmount: number;
    shippingFee?: number;
    items?: any[];
    [key: string]: any;
  };
  shopName?: string;
  className?: string;
  compact?: boolean;
  onSelectVoucher?: (selection: VoucherSelection) => Promise<boolean>;
  onApplyVoucher?: (shopId: string, voucherCode: string) => Promise<boolean>;
  appliedVouchers?: VoucherSelection;
  forcePlatform?: boolean;
}
