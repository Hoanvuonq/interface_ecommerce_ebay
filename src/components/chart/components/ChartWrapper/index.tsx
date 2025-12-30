import { cn } from "@/utils/cn";

export const ChartWrapper = ({ title, sub, children, className }: any) => (
  <div
    className={cn(
      "bg-white p-10 rounded-[3rem] border border-slate-100 relative overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]",
      "before:absolute before:top-0 before:left-0 before:w-full before:h-1.5 before:bg-slate-50",
      className
    )}
  >
    <div className="mb-10 flex flex-col gap-1">
      <h3 className="text-2xl font-semibold text-slate-800 uppercase tracking-tighter italic flex items-center gap-3">
        <div className="w-2 h-8 bg-orange-500 rounded-full" /> {title}
      </h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-5">
        {sub}
      </p>
    </div>
    {children}
  </div>
);
