export interface DropdownAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "login" | "danger";
  icon?: React.ReactNode;
  loading?: boolean;
}

export interface DropdownContainerProps {
  title: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
  footerActions?: [DropdownAction, DropdownAction]; 
  className?: string;
  maxHeight?: string;
}