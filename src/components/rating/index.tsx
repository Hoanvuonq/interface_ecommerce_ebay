import { cn } from "@/utils/cn";
import { Star } from "lucide-react";

export const CustomRate: React.FC<{
  value: number;
  disabled?: boolean;
  size?: number;
  className?: string;
}> = ({ value, disabled, size = 16, className }) => {
  const starSize = size / 4.5;
  const filledValue = Math.round(value * 2) / 2;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        let fillClass = "fill-transparent";
        if (filledValue >= i + 1) {
          fillClass = "fill-yellow-400";
        } else if (filledValue > i) {
          fillClass = "fill-yellow-400";
        }

        return (
          <Star
            key={i}
            className={cn(
              `w-${starSize} h-${starSize} text-yellow-400`,
              fillClass
            )}
            style={{ strokeWidth: 1.5 }}
          />
        );
      })}
    </div>
  );
};
