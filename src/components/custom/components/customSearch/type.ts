export interface SearchComponentProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  size?: "sm" | "md" | "lg";
  onEnter?: () => void;
  name?: string;
  id?: string;
}
