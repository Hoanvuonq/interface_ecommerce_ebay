import { ShieldCheck, Store } from "lucide-react";

export const complaintTabs = [
  {
    id: "preferred",
    label: "Khiếu nại danh hiệu Shop Yêu Thích",
    icon: <Store size={16} />,
  },
  {
    id: "intellectual",
    label: "Khiếu nại Quyền Sở Hữu Trí Tuệ",
    icon: <ShieldCheck size={16} />,
  },
];

export const subTabs = [
  { label: "Tất cả", count: 0, status: "all" },
  { label: "Đang xem xét", count: 0, status: "pending" },
  {
    label: "Chờ cung cấp thêm bằng chứng",
    count: 0,
    status: "evidence_required",
  },
  { label: "Chấp nhận", count: 0, status: "accepted" },
  { label: "Từ chối", count: 0, status: "rejected" },
];
export const typeOptions = [
  { label: "Khiếu nại danh hiệu", value: "preferred" },
  { label: "Khiếu nại sở hữu trí tuệ", value: "intellectual" },
];

export const statusOptions = [
  { label: "Đang xem xét", value: "pending" },
  { label: "Chấp nhận", value: "accepted" },
  { label: "Từ chối", value: "rejected" },
  { label: "Chờ bằng chứng", value: "evidence_required" },
];
