export interface SmartKPICardProps {
  title: string;
  value: number;
  growth?: number;
  format?: "currency" | "number";
  icon?: React.ReactNode;
  suffix?: string;
  loading?: boolean;
  colorTheme?: "blue" | "green" | "purple" | "orange";
}
