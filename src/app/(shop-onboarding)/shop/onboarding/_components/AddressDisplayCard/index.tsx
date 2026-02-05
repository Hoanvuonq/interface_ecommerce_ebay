/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  MapPin,
  Navigation,
  Plus,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/button";

interface AddressDisplayCardProps {
  address: any;
  onEdit: () => void;
  error?: string;
}

export const AddressDisplayCard: React.FC<AddressDisplayCardProps> = ({
  address,
  onEdit,
  error,
}) => {
  const renderBadges = () => {
    const badges = [];
    if (address?.isDefault)
      badges.push({
        label: "Mặc định",
        icon: CheckCircle2,
        color: "text-blue-500 bg-blue-50 border-blue-100",
      });
    if (address?.isDefaultPickup)
      badges.push({
        label: "Lấy hàng",
        icon: PackageCheck,
        color: "text-emerald-500 bg-emerald-50 border-emerald-100",
      });
    if (address?.isDefaultReturn)
      badges.push({
        label: "Hoàn hàng",
        icon: RotateCcw,
        color: "text-orange-500 bg-orange-50 border-orange-100",
      });

    return badges.map((b, i) => (
      <span
        key={i}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider",
          b.color,
        )}
      >
        <b.icon size={10} strokeWidth={3} />
        {b.label}
      </span>
    ));
  };

  if (!address) {
    return (
      <div className="space-y-3">
        <button
          onClick={onEdit}
          className={cn(
            "w-full py-16 border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center gap-4 transition-all duration-500 group relative overflow-hidden",
            error
              ? "border-red-300 bg-red-50/20 animate-shake"
              : "border-gray-200 bg-white hover:bg-orange-50/30 hover:border-orange-200 shadow-sm",
          )}
        >
          <div
            className={cn(
              "p-5 bg-white shadow-lg rounded-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 text-gray-300 group-hover:text-orange-500 shadow-gray-100",
              error && "text-red-500 shadow-red-100",
            )}
          >
            <Plus size={32} strokeWidth={3} />
          </div>
          <div className="text-center space-y-1">
            <span
              className={cn(
                "block text-xs font-bold uppercase tracking-[0.25em]",
                error
                  ? "text-red-500"
                  : "text-gray-400 group-hover:text-gray-700",
              )}
            >
              Thiết lập tọa độ lấy hàng
            </span>
            <p className="text-[10px] text-gray-400 font-medium italic opacity-0 group-hover:opacity-100 transition-opacity">
              Nhấn để cấu hình địa chỉ vận hành chính thức
            </p>
          </div>
        </button>
        {error && (
          <div className="flex items-center gap-2 ml-2 text-red-500 animate-in slide-in-from-left-2">
            <div className="w-1 h-1 rounded-full bg-red-500" />
            <p className="text-[10px] font-bold uppercase tracking-tighter italic">
              * {error}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] p-7 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-500 group">
      <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
        <MapPin size={180} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="shrink-0 p-4 bg-orange-50 rounded-3xl text-orange-500 shadow-sm shadow-orange-100 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
            <Navigation size={24} strokeWidth={2.5} />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold uppercase tracking-widest text-gray-900 italic">
                  {address.fullName || address.recipientName}
                </span>
                <div className="h-3 w-px bg-gray-200" />
                <span className="text-sm font-bold text-orange-600 tracking-tight">
                  {address.phone}
                </span>
              </div>
            </div>

            <p className="text-[13px] text-gray-500 font-medium leading-relaxed italic max-w-md">
              {address.addressDetail || address.detail}
            </p>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-white transition-colors mr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {address.wardName} — {address.provinceName}
                </span>
              </div>

              {renderBadges()}
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="edit"
          onClick={onEdit}
          className="shrink-0 flex items-center justify-center gap-3 p-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-gray-200 hover:shadow-orange-200"
        >
          Cập nhật tọa độ
        </Button>
      </div>
    </div>
  );
};
