/**
 * Format tiền tệ VND (Mặc định không hiển thị số thập phân)
 * Ví dụ: 10000 -> 10.000 ₫
 */
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format tiền tệ VND (Giữ nguyên các số thập phân mặc định của hệ thống)
 * Thường dùng khi cần độ chính xác cực cao hoặc ngoại tệ khác
 */
export const formatPriceFull = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};
