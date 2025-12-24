export interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "password";
  rules?: Array<{ required?: boolean; [key: string]: any }>;
  dependencies?: string[];
  maxLength?: number;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "url";
  disabled?: boolean;
  itemClassName?: string;
  inputClassName?: string;
  helpText?: string;
  errorMessage?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
