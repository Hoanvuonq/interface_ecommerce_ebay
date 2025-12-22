import { OrderResponse, OrderItemResponse } from "@/types/orders/order.types";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";

const PRIMARY_COLOR = '#f97316';


export interface OrderFiltersProps {
    searchText: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

export const STATUS_OPTIONS = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Đã tạo', value: 'CREATED' },
    { label: 'Chờ thanh toán', value: 'PENDING_PAYMENT' },
    { label: 'Đã thanh toán', value: 'PAID' },
    { label: 'Đang chuẩn bị', value: 'FULFILLING' },
    { label: 'Đang giao hàng', value: 'SHIPPED' },
    { label: 'Đã giao', value: 'DELIVERED' },
    { label: 'Đã hủy', value: 'CANCELLED' },
    { label: 'Đã hoàn tiền', value: 'REFUNDED' },
];

 export const STATUS_TABS = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING_PAYMENT", label: "Chờ thanh toán" },
    { key: "CREATED", label: "Chờ xác nhận" },
    { key: "FULFILLING", label: "Đang xử lý" },
    { key: "SHIPPED", label: "Đang giao" },
    { key: "DELIVERED", label: "Hoàn thành" },
    { key: "CANCELLED", label: "Đã hủy" },
  ];

export const resolveOrderItemImageUrl = (
    basePath: string | null | undefined,
    extension: string | null | undefined,
    size: '_thumb' | '_medium' | '_large' | '_orig' = '_thumb'
): string => {
    if (basePath && extension) {
        const variant = {
            imageBasePath: basePath,
            imageExtension: extension.startsWith('.') ? extension : `.${extension}`,
        };
        return resolveVariantImageUrl(variant, size);
    }
    return '';
};

// Map order status to Vietnamese and colors
export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
    CREATED: { label: 'Đã tạo', color: 'default' },
    PENDING_PAYMENT: { label: 'Chờ thanh toán', color: 'warning' },
    PAID: { label: 'Đã thanh toán', color: 'success' },
    FULFILLING: { label: 'Đang chuẩn bị', color: 'processing' },
    SHIPPED: { label: 'Đang giao hàng', color: 'processing' },
    OUT_FOR_DELIVERY: { label: 'Đang giao', color: 'processing' },
    DELIVERED: { label: 'Đã giao', color: 'success' },
    CANCELLED: { label: 'Đã hủy', color: 'error' },
    REFUNDING: { label: 'Đang hoàn tiền', color: 'warning' },
    REFUNDED: { label: 'Đã hoàn tiền', color: 'default' },
};

export const STATUS_TONE: Record<string, { strip: string; chipBg: string; chipText: string }> = {
    PENDING_PAYMENT: { strip: PRIMARY_COLOR, chipBg: '#fff5eb', chipText: '#c05621' },
    CREATED: { strip: '#2563EB', chipBg: '#e0edff', chipText: '#1d4ed8' },
    FULFILLING: { strip: '#2563EB', chipBg: '#e0edff', chipText: '#1d4ed8' },
    SHIPPED: { strip: '#16A34A', chipBg: '#ecfdf3', chipText: '#15803d' },
    OUT_FOR_DELIVERY: { strip: '#16A34A', chipBg: '#ecfdf3', chipText: '#15803d' },
    PAID: { strip: '#0D9488', chipBg: '#d1fae5', chipText: '#0f766e' },
    DELIVERED: { strip: '#0D9488', chipBg: '#d1fae5', chipText: '#0f766e' },
    CANCELLED: { strip: '#DC2626', chipBg: '#fee2e2', chipText: '#b91c1c' },
    REFUNDING: { strip: PRIMARY_COLOR, chipBg: '#fff5eb', chipText: '#c05621' },
    REFUNDED: { strip: '#6B7280', chipBg: '#f3f4f6', chipText: '#475467' },
    DEFAULT: { strip: '#E5E7EB', chipBg: '#f3f4f6', chipText: '#475467' },
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    COD: 'Thanh toán khi nhận hàng',
    VNPAY: 'VNPay',
    MOMO: 'MoMo',
    PAYOS: 'Chuyển khoản PayOS',
    BANK_TRANSFER: 'Chuyển khoản ngân hàng',
    CREDIT_CARD: 'Thẻ tín dụng',
};

export interface OrderDetailViewProps {
    order: OrderResponse;
}

export interface OrderCardProps {
  order: OrderResponse;
  onViewDetail: (orderId: string) => void;
  onOrderCancelled?: () => void;
}