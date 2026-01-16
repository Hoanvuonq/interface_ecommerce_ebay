import { InputHTMLAttributes } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  containerClassName?: string;
  sizeClassName?: string;
}
