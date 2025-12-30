import { cn } from "@/utils/cn";

export const StatCard = ({
  icon: Icon,
  title,
  value,
  colorClass, 
  bgColorClass, 
  borderColorClass, 
}: any) => (
  <div
    className={cn(
      "bg-white p-6 rounded-4xl shadow-sm border-t-4 flex flex-col items-center",
      "text-center transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1.5",
      borderColorClass
    )}
  >
    <div className={cn("p-4 rounded-2xl mb-4 shrink-0", bgColorClass)}>
      <Icon className={cn("w-7 h-7", colorClass)} strokeWidth={2.5} />
    </div>
    <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">
      {title}
    </span>
    <span className={cn("text-2xl font-semibold tracking-tight", colorClass)}>
      {value}
    </span>
  </div>
);