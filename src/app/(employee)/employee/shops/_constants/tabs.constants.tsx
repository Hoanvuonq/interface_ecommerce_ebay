import {
  ShoppingBag,
  AlertCircle,
  ShieldCheck,
  XOctagon,
  Lock,
  Archive,
} from "lucide-react";

export const SHOP_STATUS_TABS = [
  {
    key: "ALL",
    label: "Tất cả",
    icon: ShoppingBag,
  },
  {
    key: "PENDING",
    label: "Chờ duyệt",
    icon: AlertCircle,
  },
  {
    key: "ACTIVE",
    label: "Đang hoạt động",
    icon: ShieldCheck,
  },
  {
    key: "REJECTED",
    label: "Bị từ chối",
    icon: XOctagon,
  },
  {
    key: "SUSPENDED",
    label: "Bị tạm khóa",
    icon: Lock,
  },
  {
    key: "CLOSED",
    label: "Đã đóng",
    icon: Archive,
  },
] as const;
