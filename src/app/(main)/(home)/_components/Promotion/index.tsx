"use client";

import { SectionLoading } from "@/components";
import { QuickLinks } from "@/constants/section";
import { cn } from "@/utils/cn";
import { ChevronUp, MoreHorizontal } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useHomepageContext } from "../../_context/HomepageContext";
import { mapBannerToDisplay } from "../../_utils/bannerMapping";
import { HeroBanners } from "../HeroBanners";
import { QuickLinkItem } from "../QuickLinkItem";

export const Promotion: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { banners: groupedBanners, isLoading, isError } = useHomepageContext();

  const alwaysVisible = useMemo(() => QuickLinks.slice(0, 3), []);
  const expandableLinks = useMemo(() => QuickLinks.slice(3), []);

  const mappedHeroBanners = useMemo(() => {
    const heroList = groupedBanners?.hero || [];
    return heroList.map((banner: any, index: number) => mapBannerToDisplay(banner, index));
  }, [groupedBanners?.hero]);

  if (isLoading && mappedHeroBanners.length === 0) {
    return <SectionLoading message="Đang tải dữ liệu ưu đãi..." />;
  }

  return (
    <section className="bg-white shadow py-1 overflow-hidden">
      <div className="max-w-300 mx-auto w-full">
        <HeroBanners banners={isError ? [] : mappedHeroBanners} />
        <div className="mx-auto w-full mt-6">
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-y-2 gap-x-4 items-start">
            <div className="hidden lg:contents">
              {QuickLinks.map((item) => (
                <QuickLinkItem key={item.key} item={item} isLoading={isLoading} />
              ))}
            </div>
            <div className="contents lg:hidden">
              {alwaysVisible.map((item) => (
                <QuickLinkItem key={item.key} item={item} isLoading={isLoading} />
              ))}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex flex-col items-center gap-2.5 group outline-none"
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all duration-500",
                  isExpanded 
                    ? "bg-red-50 border-red-400 rotate-180 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                    : "bg-white border-red-300 hover:border-orange-400 shadow-sm"
                )}>
                  {isExpanded ? (
                    <ChevronUp className="text-red-500 w-6 h-6 stroke-[3px]" />
                  ) : (
                    <MoreHorizontal className="text-red-400 group-hover:text-orange-500 w-6 h-6 stroke-[3px]" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-bold transition-colors uppercase tracking-widest coiny-regular",
                  isExpanded ? "text-red-500" : "text-red-400 group-hover:text-orange-500"
                )}>
                  {isExpanded ? "Đóng" : "Thêm"}
                </span>
              </button>

              <div 
                className={cn(
                  "col-span-4 overflow-hidden transition-all duration-500 ease-in-out",
                  isExpanded ? "max-h-200 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                )}
              >
                <div className="grid grid-cols-4 gap-y-8 gap-x-4 pt-8 border-t border-gray-200/50">
                   {expandableLinks.map((item) => (
                    <QuickLinkItem key={item.key} item={item} isLoading={isLoading} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};