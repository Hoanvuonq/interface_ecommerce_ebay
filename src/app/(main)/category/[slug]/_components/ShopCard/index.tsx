import { Shop } from "@/app/(main)/category/_types/category";
import { cn } from "@/utils/cn";
import { CheckCircle, Crown } from "lucide-react";

export const ShopCard: React.FC<{ shop: Shop; color: string; isMobile?: boolean }> = ({ shop, color, isMobile }) => {
    // Kích thước cố định để tránh layout shift
    const containerWidth = isMobile ? 'w-[80px]' : 'w-full';
    const avatarSize = isMobile ? 'h-14 w-14 text-xl' : 'h-16 w-16 text-2xl';

    return (
        <div className={cn(
            "group relative flex flex-col items-center p-2 transition-all duration-300",
            containerWidth
        )}>
            {/* Phần Avatar Shop */}
            <div className="relative mb-3">
                {/* Vòng bezel phát sáng bên ngoài - Hiệu ứng Glow khi hover */}
                <div className={cn(
                    "absolute inset-[-4px] rounded-2xl opacity-0 blur-md transition-all duration-500 group-hover:opacity-100",
                    `bg-linear-to-br ${color}`
                )} />

                {/* Container Logo chính */}
                <div className={cn(
                    "relative flex items-center justify-center font-black text-white shadow-lg transition-all duration-300",
                    "rounded-2xl z-10",
                    "group-hover:translate-y-[-4px] group-active:translate-y-0", // Nhấc nhẹ lên thay vì scale to
                    `bg-linear-to-br ${color}`,
                    avatarSize
                )}>
                    {/* Hiệu ứng kính lấp lánh chạy qua khi hover */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 translate-x-[-100%] bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                    </div>
                    
                    {shop.name.charAt(0)}
                </div>

                {shop.verified && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 shadow-md border border-orange-100">
                        <CheckCircle className="h-3 w-3 text-orange-500 fill-orange-500" />
                        {!isMobile && <span className="text-[7px] font-black text-orange-600 uppercase">Mall</span>}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center gap-1 w-full z-10">
                <span className={cn(
                    "line-clamp-1 w-full text-center font-bold text-slate-600 transition-all duration-300",
                    isMobile ? "text-[10px]" : "text-[12px]",
                    "group-hover:text-orange-600"
                )}>
                    {shop.name}
                </span>
                
                <div className="flex items-center gap-0.5 text-[8px] text-slate-400 font-medium">
                    <span className="text-orange-500">★</span> 4.9
                </div>
            </div>

            {!isMobile && shop.verified && (
                <Crown className="absolute top-0 right-2 h-3 w-3 text-yellow-400 rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-[-2px]" />
            )}
        </div>
    );
};