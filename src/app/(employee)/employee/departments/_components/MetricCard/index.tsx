import { cn } from "@/utils/cn";

export const MetricCard = ({ label, value, color }: any) => (
  <div className={cn("p-6 rounded-4xl border border-transparent transition-all hover:border-gray-200", color)}>
    <p className="text-3xl font-semibold italic tracking-tighter leading-none">{value}</p>
    <p className="text-[10px] font-semibold uppercase tracking-widest mt-2 opacity-70">{label}</p>
  </div>
);