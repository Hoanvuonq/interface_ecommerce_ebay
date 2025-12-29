import { ReactNode } from "react";

export interface MenuItemSidebar {
  key: string;
  icon?: ReactNode;
  label: ReactNode;
  children?: MenuItemSidebar[];
  type?: "divider" | "group";
  className?: string;
  href?: string; 
}

export interface EmployeeSidebarProps {
  collapsed: boolean;
  onMobileMenuClick?: () => void;
  className?: string;
}