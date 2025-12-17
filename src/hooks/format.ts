/**
 * Format utilities
 */

/**
 * Format currency (VND)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format date to Vietnamese locale
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/**
 * Format date time to Vietnamese locale
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(d);
}

/**
 * Format number with thousand separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("vi-VN").format(num);
}

export const formatTimeSince = (dateString?: string) => {
  if (!dateString) return "Không rõ";
  const created = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Hôm nay";
  if (diffDays < 30) return `${diffDays} ngày trước`;
  const months = Math.floor(diffDays / 30);
  if (months < 12) return `${months} tháng trước`;
  const years = Math.floor(months / 12);
  return `${years} năm trước`;
};

export const formatDiscount = (voucher: any) => {
  if (!voucher) return "";
  const { discountType, discountValue, discountAmount } = voucher;

  if (discountType === "PERCENTAGE" && discountValue) {
    return `Giảm ${discountValue}%`;
  } else if (discountType === "FIXED_AMOUNT" && discountAmount) {
    if (discountAmount >= 1000) {
      return `Giảm ${Math.round(discountAmount / 1000)}k`;
    }
    return `Giảm ${new Intl.NumberFormat("vi-VN").format(discountAmount)}đ`;
  }
  return "";
};

export const formatCompactNumber = (value?: number | null) => {
  if (value === null || value === undefined) return null;
  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};
