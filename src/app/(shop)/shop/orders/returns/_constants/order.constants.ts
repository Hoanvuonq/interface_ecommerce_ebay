/**
 * Order Management UI Constants
 * Colors, themes, and configuration for the shop order management system
 */

// ==================== COLOR SYSTEM ====================

export const ORDER_COLORS = {
    STATUS: {
        COMPLETED: '#52c41a',    // 🟢 Green - Delivered, Approved, Completed
        PENDING: '#faad14',      // 🟡 Yellow - Awaiting, Fulfilling, Pending
        IN_PROGRESS: '#1890ff',  // 🔵 Blue - Shipped, In Transit, Processing
        CANCELLED: '#ff4d4f',    // 🔴 Red - Cancelled, Rejected, Failed
    },
    DEADLINE: {
        URGENT: '#ff4d4f',       // < 2 hours remaining
        WARNING: '#faad14',      // 2-6 hours remaining
        NORMAL: '#52c41a',       // > 6 hours remaining
    },
    CARRIER: {
        EXPRESS: '#ff4d4f',      // 🔥 Express delivery
        FAST: '#1890ff',         // ⚡ Fast delivery
        STANDARD: '#52c41a',     // 📦 Standard delivery
        LOCKER: '#722ed1',       // 🏪 Locker pickup
        BULKY: '#fa8c16',        // 📦 Bulky items
    },
} as const;

// ==================== STATUS CONFIGURATIONS ====================

export const ORDER_STATUS_CONFIG = {
    CREATED: { color: 'default', text: 'Đã tạo', icon: '📝' },
    AWAITING_PAYMENT: { color: 'orange', text: 'Chờ thanh toán', icon: '⏳' },
    PAID: { color: 'blue', text: 'Đã thanh toán', icon: '💰' },
    FULFILLING: { color: 'cyan', text: 'Đang chuẩn bị', icon: '📦' },
    SHIPPED: { color: 'purple', text: 'Đang giao', icon: '🚚' },
    OUT_FOR_DELIVERY: { color: 'geekblue', text: 'Đang vận chuyển', icon: '🚛' },
    DELIVERED: { color: 'green', text: 'Đã giao', icon: '✅' },
    CANCELLED: { color: 'red', text: 'Đã hủy', icon: '❌' },
    REFUNDING: { color: 'magenta', text: 'Đang hoàn tiền', icon: '↩️' },
    REFUNDED: { color: 'volcano', text: 'Đã hoàn tiền', icon: '💸' },
} as const;

export const BATCH_STATUS_CONFIG = {
    PENDING: { color: 'default', text: 'Chờ xử lý', icon: '⏳' },
    READY: { color: 'blue', text: 'Sẵn sàng', icon: '✓' },
    PICKED_UP: { color: 'cyan', text: 'Đã lấy hàng', icon: '📦' },
    IN_TRANSIT: { color: 'purple', text: 'Đang vận chuyển', icon: '🚛' },
    COMPLETED: { color: 'green', text: 'Hoàn tất', icon: '✅' },
    CANCELLED: { color: 'red', text: 'Đã hủy', icon: '❌' },
} as const;

export const RETURN_STATUS_CONFIG = {
    PENDING: { color: 'orange', text: 'Chờ duyệt', icon: '⏳' },
    APPROVED: { color: 'green', text: 'Đã duyệt', icon: '✓' },
    REJECTED: { color: 'red', text: 'Từ chối', icon: '✗' },
    PROCESSING: { color: 'blue', text: 'Đang xử lý', icon: '🔄' },
    COMPLETED: { color: 'green', text: 'Hoàn tất', icon: '✅' },
    CANCELLED: { color: 'default', text: 'Đã hủy', icon: '❌' },
} as const;

// ==================== CARRIER CATEGORIES ====================

export const CARRIER_CATEGORY_CONFIG = {
    EXPRESS: {
        icon: '🔥',
        color: '#ff4d4f',
        title: 'Hỏa Tốc',
        description: 'Giao siêu nhanh trong ngày',
    },
    FAST: {
        icon: '⚡',
        color: '#1890ff',
        title: 'Nhanh',
        description: 'Chuyên nghiệp, nhanh chóng',
    },
    LOCKER: {
        icon: '🏪',
        color: '#722ed1',
        title: 'Tủ Nhận Hàng',
        description: 'Khách tự lấy hàng',
    },
    BULKY: {
        icon: '📦',
        color: '#fa8c16',
        title: 'Hàng Cồng Kềnh',
        description: 'Giao hàng lớn',
    },
    THIRD_PARTY: {
        icon: '➕',
        color: '#52c41a',
        title: 'Thêm đơn vị vận chuyển',
        description: 'Tích hợp bên thứ 3',
    },
} as const;

// ==================== KEYBOARD SHORTCUTS ====================

export const KEYBOARD_SHORTCUTS = {
    SELECT_ALL: { key: 'a', modifier: 'ctrl', description: 'Chọn tất cả đơn hàng' },
    PRINT_AWB: { key: 'p', modifier: 'ctrl', description: 'In AWB cho đơn đã chọn' },
    CLEAR_SELECTION: { key: 'Escape', description: 'Xóa lựa chọn / Đóng panel' },
    SEARCH: { key: 'f', modifier: 'ctrl', description: 'Tìm kiếm đơn hàng' },
} as const;

// ==================== UI CONFIGURATION ====================

export const UI_CONFIG = {
    // Table configurations
    TABLE: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
        SCROLL_X: 1200,
    },

    // Side panel configurations
    SIDE_PANEL: {
        WIDTH: 700,
        TRANSITION_DURATION: 200, // ms
    },

    // Action bar configurations
    ACTION_BAR: {
        STICKY_OFFSET: 0,
        HEIGHT: 60,
    },

    // Deadline warning thresholds (in hours)
    DEADLINE_THRESHOLDS: {
        URGENT: 2,
        WARNING: 6,
    },

    // Responsive breakpoints (px)
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 1024,
        DESKTOP: 1280,
    },
} as const;

// ==================== FILTER CHIPS CONFIG ====================

export const DEFAULT_FILTERS = [
    { key: 'ALL', label: 'Tất cả', count: 0 },
    { key: 'CREATED', label: 'Đã tạo', count: 0 },
    { key: 'AWAITING_PAYMENT', label: 'Chờ thanh toán', count: 0 },
    { key: 'PAID', label: 'Đã thanh toán', count: 0 },
    { key: 'FULFILLING', label: 'Đang chuẩn bị', count: 0 },
    { key: 'SHIPPED', label: 'Đang giao', count: 0 },
    { key: 'OUT_FOR_DELIVERY', label: 'Đang vận chuyển', count: 0 },
    { key: 'DELIVERED', label: 'Đã giao', count: 0 },
    { key: 'CANCELLED', label: 'Đã hủy', count: 0 },
    { key: 'REFUNDING', label: 'Đang hoàn tiền', count: 0 },
    { key: 'REFUNDED', label: 'Đã hoàn tiền', count: 0 },
] as const;

// ==================== NAVIGATION MENU ====================

export const ORDER_NAVIGATION_ITEMS = [
    {
        key: 'all-orders',
        path: '/shop/orders',
        icon: '📦',
        label: 'Tất cả',
        description: 'Danh sách tất cả đơn hàng',
    },
    {
        key: 'bulk-shipping',
        path: '/shop/orders/bulk',
        icon: '🚚',
        label: 'Giao loạt',
        description: 'Tạo batch giao hàng loạt',
    },
    {
        key: 'handover',
        path: '/shop/orders/handover',
        icon: '📋',
        label: 'Bàn giao',
        description: 'Bàn giao đơn cho đơn vị vận chuyển',
    },
    {
        key: 'returns',
        path: '/shop/orders/returns',
        icon: '↩️',
        label: 'Trả/Hủy',
        description: 'Quản lý trả hàng và hủy đơn',
    },
    {
        key: 'settings',
        path: '/shop/orders/settings',
        icon: '⚙️',
        label: 'Cài đặt VC',
        description: 'Cài đặt vận chuyển',
    },
] as const;

// ==================== HELPER FUNCTIONS ====================

/**
 * Get deadline color based on remaining time
 */
export function getDeadlineColor(deadline: string): string {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const hoursRemaining = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining < UI_CONFIG.DEADLINE_THRESHOLDS.URGENT) {
        return ORDER_COLORS.DEADLINE.URGENT;
    } else if (hoursRemaining < UI_CONFIG.DEADLINE_THRESHOLDS.WARNING) {
        return ORDER_COLORS.DEADLINE.WARNING;
    }
    return ORDER_COLORS.DEADLINE.NORMAL;
}

/**
 * Format deadline text with urgency indicator
 */
export function formatDeadlineText(deadline: string): { text: string; isUrgent: boolean } {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const hoursRemaining = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    const isUrgent = hoursRemaining < UI_CONFIG.DEADLINE_THRESHOLDS.URGENT;

    if (hoursRemaining < 0) {
        return { text: 'Đã quá hạn', isUrgent: true };
    } else if (hoursRemaining < 1) {
        const minutesRemaining = Math.floor(hoursRemaining * 60);
        return { text: `${minutesRemaining} phút`, isUrgent: true };
    } else if (hoursRemaining < 24) {
        return { text: `${Math.floor(hoursRemaining)} giờ`, isUrgent };
    } else {
        const daysRemaining = Math.floor(hoursRemaining / 24);
        return { text: `${daysRemaining} ngày`, isUrgent: false };
    }
}
