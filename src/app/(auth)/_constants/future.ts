import React from 'react';
import { 
    FaShoppingBag, FaTruck, FaGift, FaShieldAlt, 
    FaChartBar, FaUsers, FaFileInvoiceDollar, 
    FaStore, FaUserTie, FaBox, FaChartLine 
} from 'react-icons/fa';


export type AuthPanelType = 'default' | 'shop' | 'admin' | 'return_customer' | 'return_seller' | 'employee';

interface ContentItem {
    title: string;
    description: string;
}

interface FeatureCardProps {
    icon: React.ElementType;
    iconColor: string;
    gradientFrom: string;
    gradientTo: string;
    title: string;
    description: string;
}

interface PanelContent {
    welcome: ContentItem;
    logoIcon: React.ElementType;
    logoGradientFrom: string;
    logoGradientTo: string;
    brandColorFrom: string;
    brandColorTo: string;

    features: FeatureCardProps[];
}

export const AUTH_PANEL_DATA: Record<AuthPanelType , PanelContent> = {
    default: {
        welcome: {
            title: "Tham gia cùng chúng tôi! 🎉",
            description: "Tạo tài khoản để khám phá hàng ngàn sản phẩm chất lượng và nhận ưu đãi độc quyền",
        },
        logoIcon: FaShoppingBag,
        logoGradientFrom: 'from-blue-500',
        logoGradientTo: 'to-purple-600',
        brandColorFrom: 'from-blue-600',
        brandColorTo: 'to-purple-600',
        features: [
            { icon: FaShoppingBag, iconColor: 'text-blue-600 dark:text-blue-300', gradientFrom: 'from-blue-100 dark:from-blue-900', gradientTo: 'to-blue-200 dark:to-blue-800', title: 'Hàng ngàn sản phẩm', description: 'Đa dạng và chất lượng cao' },
            { icon: FaTruck, iconColor: 'text-purple-600 dark:text-purple-300', gradientFrom: 'from-purple-100 dark:from-purple-900', gradientTo: 'to-purple-200 dark:to-purple-800', title: 'Giao hàng nhanh chóng', description: 'Toàn quốc trong 24-48h' },
            { icon: FaGift, iconColor: 'text-pink-600 dark:text-pink-300', gradientFrom: 'from-pink-100 dark:from-pink-900', gradientTo: 'to-pink-200 dark:to-pink-800', title: 'Ưu đãi độc quyền', description: 'Dành riêng cho thành viên' },
            { icon: FaShieldAlt, iconColor: 'text-green-600 dark:text-green-300', gradientFrom: 'from-green-100 dark:from-green-900', gradientTo: 'to-green-200 dark:to-green-800', title: 'Bảo mật tuyệt đối', description: 'Thông tin được mã hóa an toàn' },
        ],
    },
    
    shop: {
        welcome: {
            title: "Bắt đầu bán hàng ngay! 🚀",
            description: "Tạo tài khoản người bán để mở rộng kinh doanh và tiếp cận hàng triệu khách hàng",
        },
        logoIcon: FaStore,
        logoGradientFrom: 'from-purple-500',
        logoGradientTo: 'to-pink-600',
        brandColorFrom: 'from-purple-600',
        brandColorTo: 'to-pink-600',
        features: [
            { icon: FaShoppingBag, iconColor: 'text-purple-600 dark:text-purple-300', gradientFrom: 'from-purple-100 dark:from-purple-900', gradientTo: 'to-purple-200 dark:to-purple-800', title: 'Quản lý dễ dàng', description: 'Dashboard trực quan và hiệu quả' },
            { icon: FaTruck, iconColor: 'text-blue-600 dark:text-blue-300', gradientFrom: 'from-blue-100 dark:from-blue-900', gradientTo: 'to-blue-200 dark:to-blue-800', title: 'Hỗ trợ logistics', description: 'Kết nối đơn vị vận chuyển uy tín' },
            { icon: FaGift, iconColor: 'text-pink-600 dark:text-pink-300', gradientFrom: 'from-pink-100 dark:from-pink-900', gradientTo: 'to-pink-200 dark:to-pink-800', title: 'Phí thấp', description: 'Hoa hồng cạnh tranh nhất thị trường' },
            { icon: FaShieldAlt, iconColor: 'text-green-600 dark:text-green-300', gradientFrom: 'from-green-100 dark:from-green-900', gradientTo: 'to-green-200 dark:to-green-800', title: 'Bảo mật tuyệt đối', description: 'Thông tin được mã hóa an toàn' },
        ],
    },

    
    admin: {
        welcome: {
            title: "Hệ thống quản lý nhân viên 👔",
            description: "Đăng nhập để quản lý hệ thống, xử lý đơn hàng và hỗ trợ khách hàng một cách hiệu quả",
        },
        logoIcon: FaUserTie,
        logoGradientFrom: 'from-slate-600',
        logoGradientTo: 'to-blue-600',
        brandColorFrom: 'from-slate-700',
        brandColorTo: 'to-blue-600',
        features: [
            { icon: FaChartBar, iconColor: 'text-slate-600 dark:text-slate-300', gradientFrom: 'from-slate-100 dark:from-slate-800', gradientTo: 'to-slate-200 dark:to-slate-700', title: 'Dashboard quản lý', description: 'Theo dõi và phân tích dữ liệu' },
            { icon: FaUsers, iconColor: 'text-blue-600 dark:text-blue-300', gradientFrom: 'from-blue-100 dark:from-blue-900', gradientTo: 'to-blue-200 dark:to-blue-800', title: 'Quản lý người dùng', description: 'Quản lý tài khoản và phân quyền' },
            { icon: FaFileInvoiceDollar, iconColor: 'text-indigo-600 dark:text-indigo-300', gradientFrom: 'from-indigo-100 dark:from-indigo-900', gradientTo: 'to-indigo-200 dark:to-indigo-800', title: 'Xử lý đơn hàng', description: 'Quản lý và xử lý đơn hàng hiệu quả' },
            { icon: FaShieldAlt, iconColor: 'text-green-600 dark:text-green-300', gradientFrom: 'from-green-100 dark:from-green-900', gradientTo: 'to-green-200 dark:to-green-800', title: 'Bảo mật cao', description: 'Hệ thống bảo mật đa lớp' },
        ],
    },

    return_customer: {
        welcome: {
            title: "Chào mừng trở lại! 👋",
            description: "Đăng nhập để quản lý cửa hàng của bạn và tiếp tục mua sắm những sản phẩm tuyệt vời nhất",
        },
        logoIcon: FaShoppingBag,
        logoGradientFrom: 'from-blue-500',
        logoGradientTo: 'to-purple-600',
        brandColorFrom: 'from-blue-600',
        brandColorTo: 'to-purple-600',
        features: [
            { icon: FaShoppingBag, iconColor: 'text-blue-600 dark:text-blue-300', gradientFrom: 'from-blue-100 dark:from-blue-900', gradientTo: 'to-blue-200 dark:to-blue-800', title: 'Hàng ngàn sản phẩm', description: 'Đa dạng và chất lượng cao' },
            { icon: FaTruck, iconColor: 'text-purple-600 dark:text-purple-300', gradientFrom: 'from-purple-100 dark:from-purple-900', gradientTo: 'to-purple-200 dark:to-purple-800', title: 'Giao hàng nhanh chóng', description: 'Toàn quốc trong 24-48h' },
            { icon: FaGift, iconColor: 'text-pink-600 dark:text-pink-300', gradientFrom: 'from-pink-100 dark:from-pink-900', gradientTo: 'to-pink-200 dark:to-pink-800', title: 'Ưu đãi độc quyền', description: 'Dành riêng cho thành viên' },
            { icon: FaShieldAlt, iconColor: 'text-green-600 dark:text-green-300', gradientFrom: 'from-green-100 dark:from-green-900', gradientTo: 'to-green-200 dark:to-green-800', title: 'Bảo mật tuyệt đối', description: 'Thông tin được mã hóa an toàn' },
        ],
    },
    
    
    return_seller: {
        welcome: {
            title: "Chào mừng trở lại! 👋",
            description: "Đăng nhập để quản lý cửa hàng của bạn, theo dõi đơn hàng và phát triển kinh doanh trực tuyến",
        },
        logoIcon: FaStore,
        logoGradientFrom: 'from-purple-500',
        logoGradientTo: 'to-indigo-600',
        brandColorFrom: 'from-purple-600',
        brandColorTo: 'to-indigo-600',
        features: [
            { icon: FaBox, iconColor: 'text-purple-600 dark:text-purple-300', gradientFrom: 'from-purple-100 dark:from-purple-900', gradientTo: 'to-purple-200 dark:to-purple-800', title: 'Quản lý sản phẩm', description: 'Tạo và quản lý sản phẩm dễ dàng' },
            { icon: FaFileInvoiceDollar, iconColor: 'text-indigo-600 dark:text-indigo-300', gradientFrom: 'from-indigo-100 dark:from-indigo-900', gradientTo: 'to-indigo-200 dark:to-indigo-800', title: 'Quản lý đơn hàng', description: 'Theo dõi và xử lý đơn hàng hiệu quả' },
            { icon: FaChartLine, iconColor: 'text-pink-600 dark:text-pink-300', gradientFrom: 'from-pink-100 dark:from-pink-900', gradientTo: 'to-pink-200 dark:to-pink-800', title: 'Phân tích kinh doanh', description: 'Báo cáo và thống kê chi tiết' },
            { icon: FaShieldAlt, iconColor: 'text-green-600 dark:text-green-300', gradientFrom: 'from-green-100 dark:from-green-900', gradientTo: 'to-green-200 dark:to-green-800', title: 'Thanh toán an toàn', description: 'Hệ thống thanh toán bảo mật cao' },
        ],
    },
    employee: {
        welcome: {
            title: "Hệ thống quản lý nhân viên 👔",
            description: "Đăng nhập để quản lý hệ thống, xử lý đơn hàng và hỗ trợ khách hàng một cách hiệu quả",
        },
        logoIcon: FaUserTie,
        logoGradientFrom: 'from-slate-600',
        logoGradientTo: 'to-blue-600',
        brandColorFrom: 'from-slate-700',
        brandColorTo: 'to-blue-600',
        features: [
            { icon: FaChartBar, iconColor: 'text-slate-600 dark:text-slate-300', gradientFrom: 'from-slate-100 dark:from-slate-800', gradientTo: 'to-slate-200 dark:to-slate-700', title: 'Dashboard quản lý', description: 'Theo dõi và phân tích dữ liệu' },
            { icon: FaUsers, iconColor: 'text-blue-600 dark:text-blue-300', gradientFrom: 'from-blue-100 dark:from-blue-900', gradientTo: 'to-blue-200 dark:to-blue-800', title: 'Quản lý người dùng', description: 'Quản lý tài khoản và phân quyền' },
            { icon: FaFileInvoiceDollar, iconColor: 'text-indigo-600 dark:text-indigo-300', gradientFrom: 'from-indigo-100 dark:from-indigo-900', gradientTo: 'to-indigo-200 dark:to-indigo-800', title: 'Xử lý đơn hàng', description: 'Quản lý và xử lý đơn hàng hiệu quả' },
            { icon: FaShieldAlt, iconColor: 'text-green-600 dark:text-green-300', gradientFrom: 'from-green-100 dark:from-green-900', gradientTo: 'to-green-200 dark:to-green-800', title: 'Bảo mật cao', description: 'Hệ thống bảo mật đa lớp' },
        ],
    },
};

export const getAuthPanelData = (type: string | undefined): PanelContent => {
    const panelType = type as AuthPanelType;
    
    if (panelType && AUTH_PANEL_DATA[panelType]) {
        return AUTH_PANEL_DATA[panelType];
    }
    
    return AUTH_PANEL_DATA['default'];
};