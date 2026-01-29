import { LucideIcon } from "lucide-react";

export interface PickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: LucideIcon;
  searchText: string;
  onSearchChange: (val: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}