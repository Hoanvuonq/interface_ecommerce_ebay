import { LucideIcon } from "lucide-react";

export interface ICustomButtonActions {
  isLoading?: boolean;
  isDisabled?: boolean;
  hasChanges?: boolean;
  cancelText?: string;
  submitText?: string;
  submitIcon?: LucideIcon;
  onCancel: () => void;
  onSubmit?: () => void; 
  formId?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}
