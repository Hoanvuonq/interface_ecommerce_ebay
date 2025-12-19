import { Shop } from "@/app/category/_types/category";
import { cn } from "@/utils/cn";
import { CheckCircle } from "lucide-react";

export const ShopCard: React.FC<{ shop: Shop; color: string; isMobile?: boolean }> = ({ shop, color, isMobile }) => {
    const sizeClasses = isMobile ? 'h-14 w-14 text-2xl rounded-lg' : 'h-16 w-16 text-3xl rounded-xl';
    const paddingClasses = isMobile ? 'p-3' : 'p-4';
    const nameClasses = isMobile ? 'text-[10px] font-bold' : 'text-xs font-bold';

    return (
        <div
            className={cn(
                "group relative overflow-hidden border border-gray-100 bg-white shadow-md transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl",
                "rounded-xl"
            )}
        >
            {shop.verified && (
                <div className="absolute right-1 top-1 z-10 p-0.5 rounded-full bg-white shadow-lg">
                    <CheckCircle className={cn(isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4', 'text-blue-500 fill-blue-500')} />
                </div>
            )}
            <div className={paddingClasses}>
                <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                        `flex items-center justify-center font-black text-white shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`,
                        `bg-linear-to-br ${color}`, 
                        sizeClasses
                    )}>
                        {shop.name.charAt(0)}
                    </div>
                    <span className={cn(
                        "line-clamp-2 text-center text-gray-700 transition-colors group-hover:text-orange-600",
                        nameClasses
                    )}>
                        {shop.name}
                    </span>
                </div>
            </div>
        </div>
    );
};
