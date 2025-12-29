"use client";

import React from "react";
import { Check, Package, Truck, Home, X, Clock } from "lucide-react";

interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface OrderStatusTimelineProps {
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ 
  status, 
  createdAt, 
  updatedAt 
}) => {
  
  const standardSteps: Step[] = [
    { id: "CREATED", label: "Order Placed", icon: Check },
    { id: "PROCESSING", label: "Processing", icon: Package },
    { id: "SHIPPED", label: "Shipped", icon: Truck },
    { id: "DELIVERED", label: "Delivered", icon: Home },
  ];

  let displaySteps = [...standardSteps];
  let currentIndex = 0;

  // Xử lý logic Cancelled (Vẫn giữ bước Order Placed -> Cancelled)
  if (status === "CANCELLED") {
    displaySteps = [
      { id: "CREATED", label: "Order Placed", icon: Check },
      { id: "CANCELLED", label: "Cancelled", icon: X },
    ];
    currentIndex = 1;
  } else {
    const statusMap: Record<string, number> = {
      CREATED: 0,
      PENDING_PAYMENT: 0,
      PROCESSING: 1,
      SHIPPED: 2,
      DELIVERED: 3,
    };
    currentIndex = statusMap[status] ?? 0;
  }

  return (
    <div className="space-y-2 p-1">
      {displaySteps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === displaySteps.length - 1;
        const Icon = step.icon;
        const isCancel = step.id === "CANCELLED";

        return (
          <div key={step.id} className="relative flex items-start gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <div 
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  isCompleted 
                    ? isCancel 
                      ? "bg-red-50 border-red-500 text-red-600 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                      : "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    : "bg-zinc-50 border-zinc-200 text-zinc-300"
                }`}
              >
                <Icon size={18} strokeWidth={2.5} />
                
                {isCurrent && !isLast && (
                  <span className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isCancel ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                )}
              </div>
              
              {!isLast && (
                <div 
                  className={`w-0.5 h-12 -my-0.5 transition-all duration-700 ${
                    index < currentIndex 
                      ? isCancel ? "bg-red-500" : "bg-emerald-500"
                      : "bg-zinc-200 border-l-2 border-dashed border-zinc-200 bg-transparent"
                  }`}
                />
              )}
            </div>

            {/* Cột phải: Text */}
            <div className="flex flex-col pt-1.5 pb-8">
              <span className={`text-[15px] font-bold tracking-tight transition-colors duration-300 ${
                isCompleted 
                  ? isCancel ? "text-red-600" : "text-zinc-900" 
                  : "text-zinc-400"
              }`}>
                {step.label}
              </span>
              
              {/* Subtext ngày tháng */}
              <div className="mt-0.5 flex items-center gap-1.5">
                {isCompleted ? (
                  <span className={`text-[13px] font-medium ${isCancel ? 'text-red-400' : 'text-emerald-600'}`}>
                    {new Date(index === 0 ? createdAt : (updatedAt || createdAt)).toLocaleString("en-US", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true
                    })}
                  </span>
                ) : (
                  <span className="text-[13px] font-medium text-zinc-400 flex items-center gap-1">
                    <Clock size={12} />
                    {index === currentIndex + 1 ? "In progress" : "Pending"}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};