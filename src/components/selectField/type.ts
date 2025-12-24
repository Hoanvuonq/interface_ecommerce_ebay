export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectFieldProps {
  label?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: any) => void; 
  options: SelectOption[];
  placeholder?: string;
  errorMessage?: string;
  helpText?: string;
  containerClassName?: string;
  selectClassName?: string;
  disabled?: boolean;
  rules?: any[];
}
