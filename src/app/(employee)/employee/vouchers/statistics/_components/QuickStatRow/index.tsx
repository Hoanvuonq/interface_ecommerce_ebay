import { cn } from "@/utils/cn";

export const QuickStatRow = ({ icon, label, value, colorClass }: any) => (
  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-orange-100 transition-colors group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-xs font-bold uppercase text-slate-500 tracking-tight">
        {label}
      </span>
    </div>
    <span
      className={cn(
        "px-3 py-1 rounded-lg font-bold tabular-nums text-sm shadow-sm",
        colorClass,
      )}
    >
      {value?.toLocaleString() ?? 0}
    </span>
  </div>
);
