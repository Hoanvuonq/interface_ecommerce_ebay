export interface ActionBtnProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  color?: string;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  isIcon?: boolean;
  tooltip?: string;
}
