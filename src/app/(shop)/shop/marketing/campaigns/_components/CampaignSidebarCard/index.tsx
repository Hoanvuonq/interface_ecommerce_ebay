"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Play, Pause, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
interface SidebarCardProps {
  campaign: any;
  isSelected: boolean;
  status: { label: string; color: string };
  onSelect: () => void;
  onToggle: (e: React.MouseEvent) => void;
}

export const CampaignSidebarCard = ({
  campaign,
  isSelected,
  status,
  onSelect,
  onToggle,
}: SidebarCardProps) => {
  const isActive = campaign.status === "ACTIVE";

  const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(e);
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative bg-white rounded-3xl p-4 cursor-pointer transition-all duration-500 border overflow-hidden",
        isSelected
          ? "border-orange-100 shadow-[0_15px_30px_-10px_rgba(249,115,22,0.1)] translate-x-1"
          : "border-slate-50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:border-orange-100 hover:shadow-md hover:translate-x-1",
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-all duration-500 z-20",
          isSelected ? "bg-orange-500" : "bg-transparent",
        )}
      />

      <div className="flex items-center gap-4 relative z-10">
        <div className="relative w-16 h-16 shrink-0 rounded-[20px] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
          <Image
            src={
              toPublicUrl(campaign.bannerUrl) ||
              toPublicUrl(campaign.thumbnailUrl) ||
              "https://picsum.photos/200/200"
            }
            alt={campaign.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          {!isActive && (
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={cn(
                "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border transition-colors",
                status.label === "Đã huỷ" || campaign.status === "CANCELLED"
                  ? "bg-red-50 text-red-500 border-red-100"
                  : isActive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-slate-50  text-gray-400 border-slate-100",
              )}
            >
              {campaign.status === "CANCELLED" ? "Đã huỷ" : status.label}
            </span>
            {isActive && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <h3
            className={cn(
              "font-bold truncate text-[14px] tracking-tight transition-colors duration-300",
              isSelected ? "text-orange-600" : " text-gray-700",
            )}
          >
            {campaign.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-2">
            <Calendar size={12} className=" text-gray-300" />
            <span className="text-[10px] font-medium  text-gray-400 uppercase tracking-tighter">
              {new Date(campaign.startDate).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 z-20">
          {(campaign.status === "ACTIVE" || campaign.status === "PAUSED") && (
            <button
              onClick={handleToggleClick}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-90 shadow-sm",
                isActive
                  ? "bg-slate-900 text-white hover:bg-orange-600 shadow-slate-900/10"
                  : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20",
              )}
            >
              {isActive ? (
                <Pause size={14} fill="currentColor" />
              ) : (
                <Play size={14} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          )}

          {!isSelected && (
            <div className="p-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <ChevronRight
                size={16}
                className=" text-gray-300 translate-x-1 group-hover:translate-x-0"
              />
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-orange-500/5 to-transparent pointer-events-none" />
    </div>
  );
};
