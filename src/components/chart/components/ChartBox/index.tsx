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
      "bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-custom",
      className
    )}
  >
    <div className="flex items-center gap-3 mb-1">
      <div className="p-2.5 bg-gray-50 rounded-2xl text-gray-600">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 uppercase  italic">
        {title}
      </h3>
    </div>
    {subTitle && (
      <p className="text-[10px] font-bold text-gray-600 uppercase -tracking-tighter ml-14">
        {subTitle}
      </p>
    )}
    {children}
  </div>
);
