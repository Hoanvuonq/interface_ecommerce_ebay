"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { UserProductStatisticsDTO } from "@/types/product/user-product.dto";

type StatusType = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "ALL";

interface StatusTabsProps {
  current: StatusType;
  onChange: (key: StatusType) => void;
  statistics: UserProductStatisticsDTO | null;
  className?: string;
}

export const StatusTabs = ({
  current,
  onChange,
  statistics,
  className,
}: StatusTabsProps) => {
  const tabs = [
    {
      key: "ALL",
      label: "Tất cả",
      icon: LayoutGrid,
      count: statistics?.totalProducts,
      color: "text-gray-600",
    },
    {
      key: "DRAFT",
      label: "Bản nháp",
      icon: FileText,
      count: statistics?.draftProducts,
      color: "text-gray-500",
    },
    {
      key: "PENDING",
      label: "Chờ duyệt",
      icon: Clock,
      count: statistics?.pendingProducts,
      color: "text-amber-600",
    },
    {
      key: "APPROVED",
      label: "Đã duyệt",
      icon: CheckCircle2,
      count: statistics?.approvedProducts,
      color: "text-emerald-600",
    },
    {
      key: "REJECTED",
      label: "Từ chối",
      icon: AlertCircle,
      count: statistics?.rejectedProducts,
      color: "text-red-600",
    },
  ];

  return (
    <div className={cn("w-full overflow-x-auto no-scrollbar pb-2", className)}>
      <div className="inline-flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-100 gap-1">
        {tabs.map((tab) => {
          const isActive = current === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key as StatusType)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ease-out whitespace-nowrap select-none",
                isActive
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "transition-colors",
                  isActive ? "text-orange-500" : "text-gray-400"
                )}
              />
              <span>{tab.label}</span>

              <span
                className={cn(
                  "ml-1 px-2 py-0.5 rounded-md text-[10px] tabular-nums font-bold transition-colors",
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "bg-gray-200/50 text-gray-500"
                )}
              >
                {tab.count || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
