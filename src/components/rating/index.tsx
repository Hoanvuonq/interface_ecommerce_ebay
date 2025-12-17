import { cn } from "@/utils/cn";
import { Star } from "lucide-react";

export const CustomRate: React.FC<{
  value: number;
  disabled?: boolean;
  size?: number;
}> = ({ value, disabled, size = 16 }) => {
  const starSize = size / 4.5;
  const filledValue = Math.round(value * 2) / 2;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        let fillClass = "fill-transparent";
        if (filledValue >= i + 1) {
          fillClass = "fill-yellow-500";
        } else if (filledValue > i) {
          fillClass = "fill-yellow-300";
        }

        return (
          <Star
            key={i}
            className={cn(
              `w-${starSize} h-${starSize} text-yellow-500`,
              fillClass
            )}
            style={{ strokeWidth: 1.5 }}
          />
        );
      })}
    </div>
  );
};
