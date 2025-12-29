import { Package, Truck, RefreshCcw, ShieldCheck, LucideIcon } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface SupportCategory {
  title: string;
  icon: LucideIcon;
  description: string;
}

export const HELP_CATEGORIES: SupportCategory[] = [
  { icon: Package, title: "Đơn hàng", description: "Theo dõi, hủy hoặc thay đổi đơn." },
  { icon: Truck, title: "Vận chuyển", description: "Chính sách, phí và thời gian giao." },
  { icon: RefreshCcw, title: "Trả hàng", description: "Quy trình đổi trả và hoàn tiền." },
  { icon: ShieldCheck, title: "Bảo mật", description: "Quản lý tài khoản cá nhân." },
];

export const FAQ_LIST: FAQItem[] = [
  {
    category: "Vận chuyển",
    question: "Làm thế nào để tôi theo dõi đơn hàng quốc tế?",
    answer: "Bạn có thể nhập mã vận đơn vào phần 'Theo dõi đơn hàng' trên website. Thông tin sẽ được cập nhật thời gian thực từ đối tác vận chuyển eBay Express."
  },
  {
    category: "Thanh toán",
    question: "Có hỗ trợ thanh toán khi nhận hàng (COD) không?",
    answer: "Chúng tôi hỗ trợ COD cho đơn trong nước. Đơn quốc tế vui lòng thanh toán trước qua chuyển khoản/thẻ."
  },
  {
    category: "Trả hàng",
    question: "Chính sách đổi trả hàng hóa như thế nào?",
    answer: "Đổi trả trong vòng 7 ngày nếu có lỗi từ nhà sản xuất hoặc hư hỏng do vận chuyển."
  }
];