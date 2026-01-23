"use client";

import React from "react";
import { Zap, Timer, Sparkles } from "lucide-react";
import CountdownTimer from "@/features/CountdownTimer";

interface ActiveCampaignBannerProps {
  campaign: {
    campaignName: string;
    startTime: string;
    endTime: string;
    secondsRemaining: number;
  };
}

export const ActiveCampaignBanner: React.FC<ActiveCampaignBannerProps> = ({
  campaign,
}) => {
  return (
    <div className="relative mb-5 group select-none transition-all duration-500">
      <div className="absolute -inset-0.5 bg-linear-to-r from-orange-500 to-red-500 rounded-[1.25rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
      <div className="relative p-3 px-4 rounded-[1.15rem] border border-orange-100 bg-white/90 backdrop-blur-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative shrink-0">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 shadow-sm group-hover:scale-105 transition-transform duration-500">
              <Zap className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
            </div>
            <Sparkles className="absolute -top-1.5 -right-1.5 w-4 h-4 text-amber-400 animate-bounce" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="px-1.5 py-0.5 passero-one-regular bg-linear-to-r from-orange-600 to-red-600 rounded text-xl font-bold text-white uppercase tracking-wider shadow-sm">
                HOT SALE
              </div>
            </div>
            <h3 className="text-[15px] font-bold text-slate-700 leading-tight uppercase italic tracking-tight">
              {campaign.campaignName}
            </h3>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1.5 shrink-0">
          <div className="scale-85 md:scale-90 origin-center md:origin-right drop-shadow-sm">
            <CountdownTimer endTime={campaign.endTime} isFull={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
