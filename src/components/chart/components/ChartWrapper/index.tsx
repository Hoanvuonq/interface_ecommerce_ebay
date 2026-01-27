import { cn } from "@/utils/cn";

export const ChartWrapper = ({ title, sub, children, className }: any) => (
  <div
    className={cn(
      "bg-white p-4 rounded-4xl border border-gray-100 relative overflow-hidden",
      "transition-all shadow-sm hover:shadow-md",
      className,
    )}
  >
    <div className="mb-6 flex flex-col gap-0.5">
      <h3 className="text-lg font-bold text-gray-800 uppercase italic flex items-center gap-2">
        <div className="w-1.5 h-5 bg-orange-500 rounded-full" /> {title}
      </h3>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-3.5">
        {sub}
      </p>
    </div>
    {children}
  </div>
);
