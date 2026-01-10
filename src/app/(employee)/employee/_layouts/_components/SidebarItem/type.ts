import { MenuItemSidebar } from "../../../_types/sidebar";

export interface SidebarItemProps {
  item: MenuItemSidebar;
  collapsed: boolean;
  activeKey: string;
  openKeys: string[];
  onToggle: (key: string) => void;
  isParentOfActive?: boolean;
}