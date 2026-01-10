"use client";

import { cn } from "@/utils/cn";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


export function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-[2.2rem] border border-gray-100 shadow-sm flex flex-col justify-between h-32">
      <div>
        <Skeleton width="60%" height={12} className="mb-3" />
        <Skeleton width="40%" height={32} />
      </div>
      <div className="flex justify-end">
        <Skeleton width={50} height={20} borderRadius={8} />
      </div>
    </div>
  );
}


export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-white p-10 rounded-[3rem] border border-gray-100 relative overflow-hidden",
        className
      )}
    >
      <div className="mb-10 space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton circle width={8} height={32} />
          <Skeleton width={200} height={24} />
        </div>
        <div className="ml-5">
          <Skeleton width={150} height={10} />
        </div>
      </div>

      <Skeleton height={250} borderRadius={20} />
    </div>
  );
}


export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10 space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton width={250} height={40} />
          <Skeleton width={180} height={12} />
        </div>
        <Skeleton width={150} height={45} borderRadius={16} />
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <SkeletonChart />
        </div>
        <div className="lg:col-span-4">
          <SkeletonChart />
        </div>
      </div>

      {/* Bottom Section Skeleton (Ví dụ Table hoặc List) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100">
          <Skeleton height={30} width="40%" className="mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <Skeleton width={48} height={48} borderRadius={12} />
                  <div>
                    <Skeleton width={120} height={14} />
                    <Skeleton width={80} height={10} />
                  </div>
                </div>
                <Skeleton width={60} height={16} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100">
          <Skeleton height={30} width="50%" className="mb-6" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} height={60} borderRadius={16} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
