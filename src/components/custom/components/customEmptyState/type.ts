import { LucideIcon } from "lucide-react";

export interface CustomEmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  subIcon?: LucideIcon;
  showButton?: boolean;
  buttonText?: string;
  buttonIcon?: LucideIcon;
  link?: string;
  onAction?: () => void;
  className?: string;
}
