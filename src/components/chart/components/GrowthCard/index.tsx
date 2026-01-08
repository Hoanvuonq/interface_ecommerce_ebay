import { cn } from "@/utils/cn";
import { TrendingDown, TrendingUp } from "lucide-react";

export const GrowthCard = ({
  label,
  value,
  rate,
}: {
  label: string;
  value: number;
  rate: number;
}) => (
  <div className="bg-white p-6 rounded-[2.2rem] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
    <div className="relative z-10">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-2 group-hover:text-orange-500 transition-colors">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-semibold text-gray-900 tracking-tighter italic leading-none">
          {value}
        </span>
        <div
          className={cn(
            "flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-lg border",
            rate >= 0
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-red-50 text-red-600 border-red-100"
          )}
        >
          {rate >= 0 ? (
            <TrendingUp size={10} className="mr-1" />
          ) : (
            <TrendingDown size={10} className="mr-1" />
          )}
          {Math.abs(rate)}%
        </div>
      </div>
    </div>
    <div className="absolute right-0 bottom-0 w-24 h-1 bg-gray-50 group-hover:bg-orange-500 transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
  </div>
);
