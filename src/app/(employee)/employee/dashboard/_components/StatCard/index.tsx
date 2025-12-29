import { CustomProgressBar } from "@/components/CustomProgressBar";
import AnimatedBadge from "@/features/AnimatedBadge";
import { cn } from "@/utils/cn";

export const StatCard = ({ item }: { item: any }) => (
  <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300 relative overflow-hidden">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-orange-100/50 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

    <div className="relative z-10">
      <div className="flex justify-between items-start mb-5">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg shadow-orange-500/10 text-white group-hover:-translate-y-1 transition-transform`}
        >
          {item.icon}
        </div>
        {item.percent !== null && (
          <AnimatedBadge
            type={item.percent >= 80 ? "new" : "hot"} 
            text={`${item.percent}%`}
            size="small"
            className={cn(
              item.percent >= 80
                ? "bg-emerald-500 shadow-emerald-500/30"
                : "bg-orange-500 shadow-orange-500/30",
              "border-0"
            )}
            animation="none"
          />
        )}
      </div>

      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
          {item.title}
        </p>
        <div className="flex items-baseline gap-1.5 mb-3">
          <h3 className="text-3xl font-black text-slate-800 tracking-tighter">
            {item.value}
          </h3>
          {item.total && (
            <span className="text-slate-400 text-sm font-bold">
              / {item.total}
            </span>
          )}
        </div>
        {item.percent !== null && (
          <CustomProgressBar
            percent={item.percent}
            color={
              item.percent >= 80
                ? "bg-emerald-500"
                : "bg-gradient-to-r from-orange-400 to-amber-500"
            }
            className="h-1.5"
          />
        )}
      </div>
    </div>
  </div>
);
