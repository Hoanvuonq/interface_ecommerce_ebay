'use client';

import { QUICK_ACCESS_ITEMS } from '@/app/(main)/category/_constants/card';
import { cn } from '@/utils/cn';
import Link from 'next/link';

interface QuickAccessCardsProps {
    categorySlug?: string;
}

export default function QuickAccessCards({ categorySlug }: QuickAccessCardsProps) {
    const items = QUICK_ACCESS_ITEMS(categorySlug);

    return (
        <div className="mb-8 w-full">
            <div className="flex gap-4 overflow-x-auto px-1 pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 custom-scrollbar-none snap-x snap-mandatory">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={item.link}
                        className={cn(
                            "group relative flex min-w-[130px] flex-1 flex-col items-center gap-3 rounded-[24px] p-5 transition-all duration-500 snap-center",
                            "bg-white ring-1 ring-slate-100 md:min-w-0",
                            "hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]",
                            item.bgClass 
                        )}
                    >
                        <div className={cn(
                            "flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-white shadow-sm ring-1 transition-all duration-500",
                            "group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md",
                            "ring-white/50 group-hover:ring-current"
                        )}>
                            <div className="text-current transition-transform duration-500 group-hover:scale-110">
                                {item.icon}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col items-center gap-1.5 z-10">
                            <span className="text-center text-[12px] font-extrabold uppercase tracking-tight text-slate-800 transition-colors group-hover:text-current">
                                {item.label}
                            </span>
                            
                            {item.badge && (
                                <span className="rounded-full bg-white/60 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-tighter text-current ring-1 ring-current/20">
                                    {item.badge}
                                </span>
                            )}
                        </div>

                        <div className="absolute -bottom-4 -right-4 h-20 w-20 rotate-12 opacity-[0.02] transition-all duration-700 group-hover:rotate-[30deg] group-hover:scale-125 group-hover:opacity-[0.05]">
                            {item.icon}
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx global>{`
                .custom-scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .custom-scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}