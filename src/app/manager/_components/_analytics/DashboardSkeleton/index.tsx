"use client";
import { cn } from "@/utils/cn";
export function SkeletonCard() {
    return (
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-2xl" />
                <div className="h-3 w-24 bg-gray-100 rounded-full" />
            </div>
            <div className="h-8 w-32 bg-gray-50 rounded-xl" />
        </div>
    );
}


export function SkeletonChart({ className }: { className?: string }) {
    return (
        <div className={cn(
            "bg-white p-8 rounded-4xl border border-gray-100 shadow-sm space-y-6 animate-pulse",
            className
        )}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-gray-100 rounded-full" />
                    <div className="h-4 w-40 bg-gray-100 rounded-full" />
                </div>
                <div className="h-8 w-32 bg-gray-50 rounded-2xl" />
            </div>

            <div className="space-y-3 pt-4">
                <div className="h-4 w-full bg-gray-50 rounded-lg" />
                <div className="h-4 w-[90%] bg-gray-50 rounded-lg" />
                <div className="h-4 w-[95%] bg-gray-50 rounded-lg" />
                <div className="h-4 w-[85%] bg-gray-50 rounded-lg" />
                <div className="h-4 w-full bg-gray-50 rounded-lg" />
                <div className="h-4 w-[70%] bg-gray-50 rounded-lg" />
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="h-48 w-full bg-gray-100 rounded-[40px] animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SkeletonChart className="h-112.5" />
                <SkeletonChart className="h-112.5" />
            </div>
        </div>
    );
}