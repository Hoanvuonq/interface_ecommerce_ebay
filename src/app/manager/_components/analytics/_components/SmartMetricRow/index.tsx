interface SmartMetricRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  colorClass: string;
  bgClass: string;
  loading?: boolean;
}
export const SmartMetricRow = ({
  icon,
  label,
  value,
  suffix,
  colorClass,
  bgClass,
  loading
}: SmartMetricRowProps) => {
  return (
    <div className="group flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass} ${colorClass} shadow-sm group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>

      <div className="text-right">
        <div className="text-lg font-bold text-gray-900">
          {value}
          {suffix && (
            <span className="text-sm font-normal text-gray-500 ml-1">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
