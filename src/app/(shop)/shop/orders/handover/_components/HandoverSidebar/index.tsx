"use client";

import React from "react";
import { Truck, Store, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface HandoverSidebarProps {
  selectedCount: number;
  pickupMethod: "PICKUP" | "DROPOFF";
  setPickupMethod: (method: "PICKUP" | "DROPOFF") => void;
  onConfirm?: () => void; // Thêm hành động xác nhận
  isLoading?: boolean; // Thêm trạng thái đang xử lý
}

export const HandoverSidebar: React.FC<HandoverSidebarProps> = ({
  selectedCount,
  pickupMethod,
  setPickupMethod,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <aside className="flex flex-col gap-5 w-full">
      {/* Card: Statistics */}
      <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase  mb-4">
          Thông tin lấy hàng
        </h3>
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm font-medium">Đơn đã chọn</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl font-bold text-orange-600 tracking-tighter">
              {selectedCount}
            </span>
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
              đơn hàng
            </span>
          </div>
        </div>
      </div>

      {/* Card: Delivery Method & Actions */}
      <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div>
          <label className="text-[13px] font-bold text-gray-800 uppercase tracking-tight block mb-4">
            Phương thức bàn giao
          </label>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setPickupMethod("PICKUP")}
              className={cn(
                "group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left outline-none",
                pickupMethod === "PICKUP"
                  ? "border-orange-500 bg-orange-50/30 ring-4 ring-orange-50"
                  : "border-gray-50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50",
                isLoading && "opacity-50 cursor-not-allowed",
              )}
            >
              <div
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  pickupMethod === "PICKUP"
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "bg-white text-gray-400 border border-gray-100",
                )}
              >
                <Truck size={20} />
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-sm font-bold transition-colors",
                    pickupMethod === "PICKUP"
                      ? "text-orange-900"
                      : "text-gray-700",
                  )}
                >
                  ĐVVC đến lấy hàng
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  Shipper sẽ đến kho lấy
                </span>
              </div>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => setPickupMethod("DROPOFF")}
              className={cn(
                "group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left outline-none",
                pickupMethod === "DROPOFF"
                  ? "border-orange-500 bg-orange-50/30 ring-4 ring-orange-50"
                  : "border-gray-50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50",
                isLoading && "opacity-50 cursor-not-allowed",
              )}
            >
              <div
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  pickupMethod === "DROPOFF"
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "bg-white text-gray-400 border border-gray-100",
                )}
              >
                <Store size={20} />
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-sm font-bold transition-colors",
                    pickupMethod === "DROPOFF"
                      ? "text-orange-900"
                      : "text-gray-700",
                  )}
                >
                  Tự gửi tại bưu cục
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  Bạn mang hàng ra điểm gửi
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Nút xác nhận chính */}
        <button
          type="button"
          disabled={selectedCount === 0 || isLoading}
          onClick={onConfirm}
          className={cn(
            "w-full py-4 rounded-2xl font-bold uppercase text-xs  transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98]",
            selectedCount > 0 && !isLoading
              ? "bg-gray-900 text-white hover:bg-orange-600 shadow-orange-100"
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none",
          )}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
          {isLoading ? "Đang xử lý..." : `Xác nhận bàn giao (${selectedCount})`}
        </button>

        <hr className="border-gray-50" />

        {/* Info Alerts */}
        <div className="space-y-3">
          <div className="flex gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <MapPin size={18} className="text-blue-500 shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-bold text-blue-900 leading-none">
                Địa chỉ lấy hàng
              </span>
              <span className="text-[11px] text-blue-700/70 font-medium">
                Lấy từ cài đặt địa chỉ Shop
              </span>
            </div>
          </div>

          <div className="flex gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-bold text-emerald-900 leading-none">
                Carrier đã được gán
              </span>
              <span className="text-[11px] text-emerald-700/70 font-medium leading-tight">
                Hệ thống tự động chọn ĐVVC theo lựa chọn của Buyer.
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
