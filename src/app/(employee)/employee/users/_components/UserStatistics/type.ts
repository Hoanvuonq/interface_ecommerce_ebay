import { User, Calendar, LogIn } from "lucide-react";

export const USER_STATUS_TABS = [
  { id: "overview", label: "Tổng quan", icon: User },
  { id: "time", label: "Thời gian", icon: Calendar },
  { id: "behavior", label: "Hành vi", icon: LogIn },
] as const;
