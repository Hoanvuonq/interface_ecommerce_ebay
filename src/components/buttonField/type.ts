import { ReactNode, MouseEvent } from "react";
export type ButtonType = "primary" | "secondary" | "danger" | "text" | "login";

export interface ButtonFieldProps {
  type?:
    | "primary"
    | "secondary"
    | "danger"
    | "text"
    | "login"
    | "register"
    | "button";
  htmlType?: "button" | "submit" | "reset";
  size?: "small" | "middle" | "large";
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  form?: string;
}
