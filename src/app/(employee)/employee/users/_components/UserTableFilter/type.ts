import { Users, CheckCircle2, Clock, Lock, Trash2 } from "lucide-react";

export const DATA_TABS = [
  { key: "ALL", label: "Tất cả", icon: Users },
  { key: "ACTIVE", label: "Hoạt động", icon: CheckCircle2 },
  { key: "INACTIVE", label: "Chờ kích hoạt", icon: Clock },
  { key: "LOCKED", label: "Bị khóa", icon: Lock },
  { key: "DELETED", label: "Đã xóa", icon: Trash2 },
];

export interface UserTableFilterProps {
  logic: any;
}
