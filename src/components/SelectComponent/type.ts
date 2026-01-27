export interface Option {
  label: string;
  value: string;
}

export interface SelectProps {
  options: Option[];
  value?: string | string[];
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isMulti?: boolean;
}
