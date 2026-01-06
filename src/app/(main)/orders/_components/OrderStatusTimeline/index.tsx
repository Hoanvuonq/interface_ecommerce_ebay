"use client";

import React, { useState } from "react";
import {
  Check,
  Package,
  Truck,
  Home,
  X,
  Clock,
  ExternalLink,
} from "lucide-react";
import { OrderStatusTimelineProps } from "./type";
import { PortalModal } from "@/features/PortalModal";
import { OrderTrackingTimeline } from "../OrderTrackingTimeline";

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  status,
  createdAt,
  updatedAt,
  trackingNumber,
  carrier,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const standardSteps = [
    { id: "CREATED", label: "Đã đặt hàng", icon: Check },
    { id: "PROCESSING", label: "Đang xử lý", icon: Package },
    { id: "SHIPPED", label: "Đang giao hàng", icon: Truck },
    { id: "DELIVERED", label: "Đã giao hàng", icon: Home },
  ];

  let displaySteps = [...standardSteps];
  let currentIndex = 0;

  if (status === "CANCELLED") {
    displaySteps = [
      { id: "CREATED", label: "Đã đặt hàng", icon: Check },
      { id: "CANCELLED", label: "Đã hủy đơn", icon: X },
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

        const canShowTracking =
          (step.id === "SHIPPED" || step.id === "DELIVERED") &&
          isCompleted &&
          trackingNumber;

        return (
          <div key={step.id} className="relative flex items-start gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                  isCompleted
                    ? isCancel
                      ? "bg-red-50 border-red-500 text-red-600 shadow-sm"
                      : "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm"
                    : "bg-zinc-50 border-zinc-200 text-zinc-300"
                }`}
              >
                <Icon size={18} strokeWidth={2.5} />
                {isCurrent && !isLast && (
                  <span
                    className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                      isCancel ? "bg-red-400" : "bg-emerald-400"
                    }`}
                  ></span>
                )}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 h-10 -my-0.5 transition-all duration-700 ${
                    index < currentIndex
                      ? isCancel
                        ? "bg-red-500"
                        : "bg-emerald-500"
                      : "bg-zinc-200 border-l-2 border-dashed border-zinc-200"
                  }`}
                />
              )}
            </div>

            <div className="flex-1 flex justify-between items-start pt-1.5 pb-8">
              <div className="flex flex-col">
                <span
                  className={`text-[12px] font-bold tracking-tight ${
                    isCompleted
                      ? isCancel
                        ? "text-red-600"
                        : "text-zinc-900"
                      : "text-zinc-400"
                  }`}
                >
                  {step.label}
                </span>

                <div className="mt-0.5 flex items-center gap-1.5">
                  {isCompleted ? (
                    <span
                      className={`text-[10px] font-medium ${
                        isCancel ? "text-red-400" : "text-emerald-600"
                      }`}
                    >
                      {new Date(
                        index === 0 ? createdAt : updatedAt || createdAt
                      ).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                      <Clock size={12} />
                      {index === currentIndex + 1
                        ? "Đang thực hiện"
                        : "Chờ xử lý"}
                    </span>
                  )}
                </div>
              </div>

              {canShowTracking && isCurrent && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-100 uppercase tracking-wider active:scale-95"
                >
                  <ExternalLink size={12} />
                  Xem hành trình
                </button>
              )}
            </div>
          </div>
        );
      })}

      <PortalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Chi tiết vận chuyển"
        width="max-w-xl"
      >
        <div className="py-2">
          {trackingNumber && carrier ? (
            <OrderTrackingTimeline
              trackingCode={trackingNumber}
              carrier={carrier}
            />
          ) : (
            <div className="text-center py-10 text-zinc-400">
              Không tìm thấy thông tin vận chuyển
            </div>
          )}
        </div>
      </PortalModal>
    </div>
  );
};
