"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Copy,
  Calendar,
  Truck,
  CreditCard,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { OrderExpirationTimer } from "../OrderExpirationTimer";
import { OrderHeaderProps } from "./type";

export const OrderHeader: React.FC<OrderHeaderProps> = ({ order, ui, actions }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 uppercase">
              Chi tiết đơn hàng
            </h1>
            <div className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border flex items-center gap-1.5",
              ui.statusInfo.bg, ui.statusInfo.text, ui.statusInfo.border
            )}>
              {ui.isDelivered ? <CheckCircle2 size={12} /> : ui.isCancelled ? <XCircle size={12} /> : ui.statusInfo.icon}
              {ui.statusInfo.label}
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-[11px] text-gray-600">
            <button 
              onClick={actions.handleCopyOrderNumber}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-mono"
            >
              #{order.orderNumber} <Copy size={10} />
            </button>
            <span className="w-1 h-1 rounded-full bg-gray-200" />
            <div className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
          <div className="flex items-center gap-2">
            <div className="text-gray-600"><Truck size={14} /></div>
            <div className="leading-tight">
              <p className="text-[9px] uppercase font-bold text-gray-600 tracking-wider">Giao qua</p>
              <p className="text-xs font-semibold text-gray-700">{order.carrier || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
            <div className="text-gray-600"><CreditCard size={14} /></div>
            <div className="leading-tight">
              <p className="text-[9px] uppercase font-bold text-gray-600 tracking-wider">Thanh toán</p>
              <p className="text-[11px] font-semibold text-blue-600 uppercase">{ui.paymentLabel}</p>
            </div>
          </div>
        </div>
        {ui.canCancel && (
        <div className="border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-gray-500 italic">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Vui lòng hoàn tất trước khi hết hạn
          </div>
          <div className="flex items-center gap-3">
            <OrderExpirationTimer
              expiresAt={order.expiresAt}
              onExpire={actions.handleRefresh}
            />
            <button
              onClick={() => actions.setCancelModalVisible(true)}
              className="px-4 py-1.5 bg-white border border-red-200 text-red-500 text-[10px] font-bold uppercase rounded-lg hover:bg-red-50 transition-all active:scale-95"
            >
              Hủy đơn
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};