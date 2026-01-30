export interface DateTimeInputProps {
  label?: string;
  value?: string; // Định dạng ISO string (vd: 2026-01-30T...)
  onChange: (val: string) => void; // Xác định rõ kiểu string tại đây
  required?: boolean;
  error?: string;
}