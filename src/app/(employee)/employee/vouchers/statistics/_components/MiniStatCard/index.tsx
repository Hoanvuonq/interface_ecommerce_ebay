import { cn } from "@/utils/cn";

export const MiniStatCard = ({ label, value, color, bg }: any) => (
  <div
    className={cn(
      "p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm",
      bg,
    )}
  >
    <span className={cn("text-xl font-bold tabular-nums", color)}>
      {value ?? 0}
    </span>
    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">
      {label}
    </span>
  </div>
);
