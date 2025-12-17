export type WelcomeTextType = 'shop' | 'default' | 'admin' | 'return_customer' | 'return_seller';

interface ContentItem {
    title: string;
    description: string;
}

export const WELCOME_TEXT_CONTENT: Record<WelcomeTextType | 'fallback', ContentItem> = {
    shop: {
        title: "Bắt đầu bán hàng ngay! 🚀",
        description: "Tạo tài khoản người bán để mở rộng kinh doanh và tiếp cận hàng triệu khách hàng",
    },
    
    default: {
        title: "Tham gia cùng chúng tôi! 🎉",
        description: "Tạo tài khoản để khám phá hàng ngàn sản phẩm chất lượng và nhận ưu đãi độc quyền",
    },
    
    admin: {
        title: "Hệ thống quản lý nhân viên 👔",
        description: "Đăng nhập để quản lý hệ thống, xử lý đơn hàng và hỗ trợ khách hàng một cách hiệu quả",
    },
    
    return_customer: {
        title: "Chào mừng trở lại! 👋",
        description: "Đăng nhập để quản lý cửa hàng của bạn và tiếp tục mua sắm những sản phẩm tuyệt vời nhất",
    },
    
    return_seller: {
        title: "Chào mừng trở lại! 👋",
        description: "Đăng nhập để quản lý cửa hàng của bạn, theo dõi đơn hàng và phát triển kinh doanh trực tuyến",
    },

    fallback: {
        title: "Chào mừng! 👋",
        description: "Vui lòng đăng nhập/đăng ký để tiếp tục trải nghiệm.",
    }
};

export const getWelcomeTextContent = (type: WelcomeTextType | string): ContentItem => {
    return WELCOME_TEXT_CONTENT[type as WelcomeTextType] || WELCOME_TEXT_CONTENT.fallback;
};