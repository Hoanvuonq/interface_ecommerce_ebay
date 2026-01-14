import { cn } from "@/utils/cn";

export const StatCard = ({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) => {
    const colorMap: any = {
        orange: "text-orange-600 bg-orange-50 border-gray-100",
        red: "text-red-600 bg-red-50 border-red-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
    };

    return (
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-50">
            <div className={cn("p-3 rounded-2xl shrink-0 border", colorMap[color])}>
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest leading-none mb-1.5">{label}</div>
                <div className="text-xl font-semibold text-gray-900 leading-none">{value}</div>
            </div>
        </div>
    );
}