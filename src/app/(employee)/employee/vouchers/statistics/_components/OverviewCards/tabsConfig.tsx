import { LayoutGrid, CheckCircle2, PlayCircle, Clock } from "lucide-react";

export const GET_OVERVIEW_CONFIG = (overview: any) => [
  {
    title: "Tổng số Voucher",
    value: overview?.totalVouchers ?? 0,
    icon: <LayoutGrid size={20} />,
    colorTheme: "blue" as const,
    trend: "+12%", 
  },
  {
    title: "Đang hoạt động",
    value: overview?.activeVouchers ?? 0,
    icon: <PlayCircle size={20} />,
    colorTheme: "orange" as const,
  },
  {
    title: "Hết hạn sử dụng",
    value: overview?.expiredVouchers ?? 0,
    icon: <Clock size={20} />,
    colorTheme: "purple" as const,
  },
  {
    title: "Tổng lượt dùng",
    value: overview?.totalUsage ?? 0,
    icon: <CheckCircle2 size={20} />,
    colorTheme: "green" as const,
  },
];
