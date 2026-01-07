import { formatCurrency } from "@/utils/analytics/formatters";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    color?: string;
  }>;
  label?: string;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const todayVal = (payload[0]?.value as number) || 0;
    const yesterdayVal = (payload[1]?.value as number) || 0;
    const diff =
      yesterdayVal > 0 ? ((todayVal - yesterdayVal) / yesterdayVal) * 100 : 0;
    const isPositive = diff >= 0;

    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-100 rounded-xl shadow-xl">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          {label}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#EE4D2D]" />
              <span className="text-sm text-gray-600 font-medium">Hôm nay</span>
            </div>
            <span className="text-base font-bold text-[#EE4D2D]">
              {formatCurrency(todayVal)}
            </span>
          </div>

          {/* Yesterday */}
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-sm text-gray-600 font-medium">Hôm qua</span>
            </div>
            <span className="text-sm font-semibold text-gray-500">
              {formatCurrency(yesterdayVal)}
            </span>
          </div>

          {yesterdayVal > 0 && (
            <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-600">Tăng trưởng</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isPositive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isPositive ? "+" : ""}
                {diff.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};
