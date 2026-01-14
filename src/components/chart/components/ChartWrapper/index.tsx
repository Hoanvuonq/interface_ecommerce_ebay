import { cn } from "@/utils/cn";

export const ChartWrapper = ({ title, sub, children, className }: any) => (
  <div
    className={cn(
      "bg-white p-10 rounded-[3rem] border border-gray-100 relative overflow-hidden ",
      "transition-all shadow-custom",
      "before:absolute before:top-0 before:left-0 before:w-full before:h-1.5 before:bg-gray-50",
      className
    )}
  >
    <div className="mb-10 flex flex-col gap-1">
      <h3 className="text-2xl font-semibold text-gray-800 uppercase italic flex items-center gap-3">
        <div className="w-2 h-8 bg-(--color-mainColor) rounded-full" /> {title}
      </h3>
      <p className="text-[10px] font-semibold text-gray-700 uppercase -tracking-tighter ml-5">
        {sub}
      </p>
    </div>
    {children}
  </div>
);
