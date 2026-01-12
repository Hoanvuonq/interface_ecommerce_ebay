
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}


export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatDateTime(date?: string | Date | null): string {
  if (!date) return "--:--";

  // Bước fix: Đảm bảo chuỗi có định dạng ISO chuẩn bằng cách thêm 'Z' (nếu backend trả về giờ UTC)
  // hoặc cắt bớt phần micro giây dư thừa nếu trình duyệt không đọc được.
  let dateString = typeof date === "string" ? date : date.toISOString();
  
  // Một số trình duyệt cũ kén định dạng có > 3 chữ số mili giây
  if (typeof date === "string" && date.includes('.')) {
    const parts = date.split('.');
    // Giữ lại tối đa 3 chữ số ở phần mili giây
    dateString = parts[0] + '.' + parts[1].substring(0, 3);
  }

  const d = new Date(dateString);
  
  if (isNaN(d.getTime())) return "Ngày không hợp lệ";

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export const formatTimeSince = (dateString?: string) => {
  if (!dateString) return "--:--";

  let processedDate = dateString;
  if (dateString.includes('.')) {
    processedDate = dateString.split('.')[0]; 
  }

  const created = new Date(processedDate);
  const now = new Date();

  const isToday = 
    created.getDate() === now.getDate() &&
    created.getMonth() === now.getMonth() &&
    created.getFullYear() === now.getFullYear();

  if (isToday) {
    return created.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  return created.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
};

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("vi-VN").format(num);
}


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
