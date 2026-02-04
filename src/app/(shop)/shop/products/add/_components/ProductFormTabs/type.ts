import { LucideIcon } from "lucide-react";
import { TabType } from ".";


export interface TabConfig {
  key: TabType;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export interface ProductFormTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  children: React.ReactNode;
  className?: string;
}
