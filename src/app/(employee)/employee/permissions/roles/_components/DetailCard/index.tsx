import { cn } from "@/utils/cn";

export const DetailCard = ({
  label,
  value,
  icon: Icon,
  className = "",
}: {
  label: string;
  value: string | React.ReactNode;
  icon: any;
  className?: string;
}) => (
  <div
    className={cn(
      "p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-orange-200 transition-all duration-300 group",
      className,
    )}
  >
    <div className="flex items-center gap-2 mb-1.5">
      <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
        <Icon size={12} strokeWidth={2.5} />
      </div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </label>
    </div>
    <div className="text-gray-800 font-bold text-sm leading-tight break-all">
      {value || <span className="text-gray-300 font-normal italic">N/A</span>}
    </div>
  </div>
);
