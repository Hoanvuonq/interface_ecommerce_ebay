export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "dashed" | "dark" | "outline" | "edit";
  loading?: boolean;
  icon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}
