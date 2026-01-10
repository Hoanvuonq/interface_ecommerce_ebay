import { cn } from "@/utils/cn";

export const CustomProgressBar: React.FC<{
  percent: number;
  color?: string; 
  className?: string; 
}> = ({ percent, color = "bg-orange-500", className }) => (
  <div className={cn("w-full h-1.5 bg-gray-100 rounded-full overflow-hidden", className)}>
    <div
      className={cn(
        "h-full rounded-full transition-all duration-700 ease-out", 
        color 
      )}
      style={{ width: `${percent}%` }}
    />
  </div>
);