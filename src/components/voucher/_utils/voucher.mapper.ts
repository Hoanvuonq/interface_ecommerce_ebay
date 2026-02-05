import {
  VoucherRecommendationResult,
  VoucherOption,
  Voucher,
} from "../_types/voucher";

export const flattenVoucher = (item: any): VoucherOption | null => {
  if (!item) return null;

  // 1. Xác định đâu là "ruột" của Voucher
  // Nếu là kết quả từ API Recommend thì nó nằm trong item.voucher
  // Nếu là API danh sách đơn thuần thì nó chính là item
  const v: Voucher = item.voucher || item;

  if (!v || !v.code) return null;

  return {
    ...v, // Copy toàn bộ thuộc tính gốc của Voucher

    // Đưa các thuộc tính từ kết quả Recommend ra ngoài cùng cấp
    applicable: item.applicable ?? false,
    reason: item.reason || null,
    calculatedDiscount: item.calculatedDiscount || 0,

    // 🟢 MAPPING ALIAS: Giúp UI linh hoạt
    discount: item.calculatedDiscount || 0, // Dùng cho hiển thị số tiền giảm thực tế
    discountAmount: v.discountValue || 0, // Giá trị niêm yết của voucher
    minOrderValue: v.minOrderAmount || 0,
    discountMethod: v.discountType || "FIXED_AMOUNT",
    voucherType: v.voucherScope || "ORDER",

    // 🔵 LOGIC TRẠNG THÁI: Để Component chỉ việc check true/false
    canSelect: item.applicable !== false,
    isValid: v.active !== false,

    // Đảm bảo các trường ảnh luôn có giá trị
    imageBasePath: v.imageBasePath || "",
    imageExtension: v.imageExtension || "",
  };
};
