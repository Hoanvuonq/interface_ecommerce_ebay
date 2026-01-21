"use client";

import { formatDateTime } from "@/hooks/format";
import { cn } from "@/utils/cn";
import { Calendar, ChevronRight, Zap } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CampaignCardProps {
  campaign: any;
  isSelected: boolean;
  onSelect: (campaign: any) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(campaign)}
      className={cn(
        "group relative bg-white rounded-3xl p-4 cursor-pointer transition-all duration-500 border overflow-hidden",
        isSelected
          ? "border-orange-100 shadow-custom translate-x-1"
          : "border-slate-50 shadow-custom shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:border-orange-100 hover:shadow-md hover:translate-x-1",
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-all duration-500",
          isSelected ? "bg-orange-500" : "bg-transparent",
        )}
      />

      <div className="flex items-center gap-4 relative z-10">
        <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm">
          <Image
            src={campaign.thumbnailUrl || "https://picsum.photos/200/200"}
            alt={campaign.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={cn(
                "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider",
                isSelected
                  ? "bg-orange-50 text-orange-600"
                  : "bg-slate-50 text-slate-400",
              )}
            >
              {campaign.campaignType}
            </span>
          </div>

          <h3
            className={cn(
              "font-bold truncate text-[14px] tracking-tight transition-colors duration-300",
              isSelected ? "text-slate-900" : "text-slate-700",
            )}
          >
            {campaign.name}
          </h3>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateTime(campaign.startDate)}
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-400/80">
              <Zap size={12} className="fill-current" />
              <span>{campaign.totalSlots} Slots</span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "w-8 h-8 rounded-2xl flex items-center justify-center transition-all duration-300",
            isSelected
              ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
              : "bg-slate-50 text-slate-300 group-hover:bg-orange-50 group-hover:text-orange-400",
          )}
        >
          <ChevronRight
            size={16}
            className={cn(
              "transition-transform duration-300",
              isSelected ? "translate-x-0.5" : "group-hover:translate-x-0.5",
            )}
          />
        </div>
      </div>
    </div>
  );
};
