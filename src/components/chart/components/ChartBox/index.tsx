import { cn } from "@/utils/cn";

export const ChartBox = ({
  title,
  subTitle,
  icon,
  children,
  className,
}: any) => (
  <div
    className={cn(
      "bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]",
      className
    )}
  >
    <div className="flex items-center gap-3 mb-1">
      <div className="p-2.5 bg-slate-50 rounded-2xl text-slate-600">{icon}</div>
      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">
        {title}
      </h3>
    </div>
    {subTitle && (
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-14">
        {subTitle}
      </p>
    )}
    {children}
  </div>
);
