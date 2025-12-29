import { CreditCard, Headphones, RefreshCcw, ShieldCheck, Star, ThumbsUp, Users } from "lucide-react";
interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
}

export const reviews: Review[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    rating: 5,
    comment: "Sản phẩm tuyệt vời, giao hàng rất nhanh.",
    date: "2 ngày trước",
  },
  {
    id: "2",
    name: "Trần Thị B",
    rating: 5,
    comment: "Giá cả hợp lý, hỗ trợ khách hàng rất tận tình.",
    date: "5 ngày trước",
  },
  {
    id: "3",
    name: "Lê Văn C",
    rating: 4,
    comment: "Đóng gói cẩn thận, sản phẩm đúng mô tả.",
    date: "1 tuần trước",
  },
];

export const stats = [
  {
    label: "Khách hàng",
    value: "10k+",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Đánh giá",
    value: "4.8",
    icon: Star,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    label: "Hài lòng",
    value: "99%",
    icon: ThumbsUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Hỗ trợ",
    value: "24/7",
    icon: Headphones,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export const trustBadges = [
  {
    icon: ShieldCheck,
    title: "An toàn",
    desc: "Bảo mật SSL 256",
    color: "text-green-600",
  },
  {
    icon: RefreshCcw,
    title: "Đổi trả",
    desc: "Miễn phí 30 ngày",
    color: "text-blue-600",
  },
  {
    icon: CreditCard,
    title: "Thanh toán",
    desc: "Đa dạng hình thức",
    color: "text-orange-500",
  },
];
