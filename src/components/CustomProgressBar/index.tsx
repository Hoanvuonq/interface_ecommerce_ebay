import { cn } from "@/utils/cn";

export const CustomProgressBar: React.FC<{
  percent: number;
  color?: string;
}> = ({ percent, color = "bg-yellow-500" }) => (
  <div className="w-full h-2 bg-gray-200 rounded-full">
    <div
      className={cn("h-full rounded-full transition-all duration-500", color)}
      style={{ width: `${percent}%` }}
    />
  </div>
);
