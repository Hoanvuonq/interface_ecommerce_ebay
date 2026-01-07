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
        <div className="mb-8 max-w-5xl mx-auto">
            <div className="flex gap-4 overflow-x-auto px-1 pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 custom-scrollbar-none snap-x snap-mandatory">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={item.link}
                        className={cn(
                            "group relative flex min-w-30 flex-1 flex-col items-center gap-3 rounded-xl p-2 transition-all duration-500 snap-center",
                            "bg-white ring-1 ring-gray-100 md:min-w-0",
                            "hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]",
                            "bg-white text-orange-600 shadow-md"
                        )}
                    >
                        <div className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl bg-white shadow-sm ring-1 transition-all duration-500",
                            "group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md",
                            "ring-white/50 group-hover:ring-current"
                        )}>
                            <div className="text-current transition-transform duration-500 group-hover:scale-110">
                                {item.icon}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-1.5 z-10">
                            <span className="text-center text-[10px] font-bold uppercase  text-gray-800 transition-colors group-hover:text-current">
                                {item.label}
                            </span>
                            
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