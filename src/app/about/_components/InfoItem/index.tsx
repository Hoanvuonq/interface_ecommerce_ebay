import { cn } from "@/utils/cn";

export const InfoItem = ({
  icon: Icon,
  title,
  content,
  subContent,
  colorClass,
  bgColorClass,
}: any) => (
  <div className="flex items-start gap-5 p-5 rounded-3xl hover:bg-gray-50/80 transition-all duration-300 group border border-transparent hover:border-gray-100">
    <div className={cn("p-3.5 rounded-2xl shrink-0 shadow-sm", bgColorClass)}>
      <Icon className={cn("w-6 h-6", colorClass)} strokeWidth={2} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] mb-1.5">
        {title}
      </h4>
      <div className="text-gray-800 font-bold text-[15px] leading-snug wrap-break-words">
        {content}
      </div>
      {subContent && (
        <div className="text-gray-400 text-xs italic mt-1.5 font-medium leading-relaxed">
          {subContent}
        </div>
      )}
    </div>
  </div>
);