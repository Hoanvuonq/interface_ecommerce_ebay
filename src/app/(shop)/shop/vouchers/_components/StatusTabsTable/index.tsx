"use client";

import React, { useMemo } from "react";
import { Ticket, Zap, ShieldCheck, ShoppingBag } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, LayoutGroup } from "framer-motion";

// Định nghĩa kiểu dữ liệu cho props để linh hoạt hơn
type VoucherScope = "all" | "shop" | "platform" | "applicableForShop";

interface StatusTabsTableProps {
  current: VoucherScope;
  onChange: (key: VoucherScope) => void;
  stats: {
    totalVouchers: number;
    shopVouchers: number;
    platformVouchers: number;
    applicableVouchers: number;
  };
  className?: string;
}

export const StatusTabsTable = ({
  current,
  onChange,
  stats,
  className,
}: StatusTabsTableProps) => {
  const tabs = useMemo(
    () => [
      {
        id: "shop" as VoucherScope,
        label: "Voucher của tôi",
        count: stats.shopVouchers,
        icon: Ticket,
      },
      {
        id: "platform" as VoucherScope,
        label: "Kho Platform",
        count: stats.platformVouchers,
        icon: Zap,
      },
      {
        id: "applicableForShop" as VoucherScope,
        label: "Khả dụng",
        count: stats.applicableVouchers,
        icon: ShieldCheck,
      },
      {
        id: "all" as VoucherScope,
        label: "Tất cả",
        count: stats.totalVouchers,
        icon: ShoppingBag,
      },
    ],
    [stats]
  );

  return (
    <div className={cn("w-full overflow-x-auto no-scrollbar pb-2", className)}>
      <LayoutGroup id="voucher-table-tabs">
        <div className="inline-flex bg-gray-100/80 p-1.5 rounded-2xl border border-gray-100 gap-1 relative">
          {tabs.map((tab) => {
            const isActive = current === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors duration-300 whitespace-nowrap select-none group",
                  isActive
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill-table"
                    className="absolute inset-0 bg-white shadow-sm ring-1 ring-gray-200"
                    style={{ borderRadius: 12 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-2">
                  <Icon
                    size={16}
                    className={cn(
                      "transition-colors duration-300",
                      isActive
                        ? "text-orange-500"
                        : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  <span>{tab.label}</span>

                   <span
                    className={cn(
                      "ml-1 px-2 py-0.5 rounded-md text-[10px] tabular-nums font-bold transition-all duration-300",
                      isActive
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-gray-200/50 text-gray-500 group-hover:bg-gray-200"
                    )}
                  >
                    {tab.count || 0}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
};
