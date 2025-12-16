
interface FooterLinkItem {
    href: string;
    label: string;
}

export const QUICK_LINKS: FooterLinkItem[] = [
    { href: "/about", label: "Về chúng tôi" },
    { href: "/careers", label: "Tuyển dụng" },
    { href: "/news", label: "Tin tức" },
    { href: "/partners", label: "Đối tác" },
    { href: "/investors", label: "Nhà đầu tư" },
];

export const CUSTOMER_SERVICE_LINKS: FooterLinkItem[] = [
    { href: "/help", label: "Trung tâm trợ giúp" },
    { href: "/shipping", label: "Vận chuyển" },
    { href: "/returns", label: "Đổi trả" },
    { href: "/warranty", label: "Bảo hành" },
    { href: "/faq", label: "Câu hỏi thường gặp" },
];

export const LEGAL_LINKS: FooterLinkItem[] = [
    { href: "/privacy", label: "Chính sách bảo mật" },
    { href: "/terms", label: "Điều khoản sử dụng" },
    { href: "/data-deletion", label: "Xóa dữ liệu" },
    { href: "/cookies", label: "Cookie Policy" },
];