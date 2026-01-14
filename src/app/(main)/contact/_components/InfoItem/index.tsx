import { cn } from "@/utils/cn";

export const InfoItem = ({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "p-6 bg-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 group",
      className
    )}
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-orange-50 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shrink-0">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
          {title}
        </h4>
        <div className="text-gray-800 font-medium leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  </div>
);
