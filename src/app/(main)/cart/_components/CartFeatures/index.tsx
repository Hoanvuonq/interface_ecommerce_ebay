import { cn } from "@/utils/cn";
import { features } from "./type";

export const CartFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-gray-50 overflow-hidden rounded-b-3xl">
      {features.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={cn(
              "flex md:flex-col items-center gap-4 md:gap-3 p-6 text-left md:text-center transition-colors bg-white",
              index === 1 && "bg-gray-50/30 md:border-x border-gray-100",
              item.hoverClass
            )}
          >
            <div className={cn(
              "shrink-0 rounded-xl w-12 h-12 flex items-center justify-center",
              item.iconBgClass
            )}>
              <Icon className={cn("w-6 h-6", item.colorClass, item.iconFillClass)} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm leading-tight">
                {item.title}
              </h4>
              <p className="text-gray-500 text-xs mt-1">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};