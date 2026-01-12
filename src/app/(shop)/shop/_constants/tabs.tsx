import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  LayoutGrid,
  XCircle,
} from "lucide-react";
import { UserProductStatisticsDTO } from "@/types/product/user-product.dto";
import { StatusTabItem } from "../_components/Products/StatusTabs/type";

// 1. Cấu hình danh sách Tabs (Static)
export const PRODUCT_TAB_CONFIG = [
  {
    key: "ALL",
    label: "Tất cả",
    icon: LayoutGrid,
    color: "text-gray-600",
    statKey: "totalProducts", // Key tương ứng trong object statistics
  },
  {
    key: "DRAFT",
    label: "Bản nháp",
    icon: FileText,
    color: "text-gray-500",
    statKey: "draftProducts",
  },
  {
    key: "PENDING",
    label: "Chờ duyệt",
    icon: Clock,
    color: "text-amber-600",
    statKey: "pendingProducts",
  },
  {
    key: "APPROVED",
    label: "Đã duyệt",
    icon: CheckCircle2,
    color: "text-emerald-600",
    statKey: "approvedProducts",
  },
  {
    key: "REJECTED",
    label: "Từ chối",
    icon: AlertCircle,
    color: "text-red-600",
    statKey: "rejectedProducts",
  },
] as const;

// 2. Cấu hình hiển thị trạng thái trong Table (Badge)
export const PRODUCT_STATUS_UI = {
  DRAFT: {
    bg: "bg-gray-100",
    text: "text-gray-500",
    label: "Bản nháp",
    icon: FileText,
  },
  PENDING: {
    bg: "bg-amber-50",
    text: "text-(--color-mainColor)", // Hoặc text-amber-600
    label: "Chờ duyệt",
    icon: Clock,
  },
  APPROVED: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    label: "Đã duyệt",
    icon: CheckCircle2,
  },
  REJECTED: {
    bg: "bg-red-50",
    text: "text-red-600",
    label: "Từ chối",
    icon: XCircle,
  },
};