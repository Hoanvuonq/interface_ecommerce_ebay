"use client";

import React from "react";
import { FeatureCardProps } from "../FeatureCard";
import { cn } from "@/utils/cn";

interface MobileFeatureListProps {
  features: Array<FeatureCardProps & { title?: string }>;
}

export const MobileFeatureList: React.FC<MobileFeatureListProps> = ({
  features,
}) => (
  <div className="lg:hidden mt-8 grid grid-cols-2 gap-4 px-1">
    {features.map((feature, idx) => {
      const Icon = feature.icon;
      return (
        <div
          key={idx}
          className={cn(
            "group relative overflow-hidden rounded-2xl p-5 py-7",
            "bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl", 
            "border border-white/40 dark:border-white/10", 
            "shadow-futureBox ", 
            "transition-all duration-300 active:scale-95 hover:-translate-y-1 cursor-pointer"
          )}
        >
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
            "bg-linear-to-br", feature.gradientFrom, feature.gradientTo
          )} />

          <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
            <div
              className={cn(
                "w-12 h-12 mb-3 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                "bg-linear-to-br",
                feature.gradientFrom,
                feature.gradientTo
              )}
            >
              <Icon className={cn(feature.iconColor, "text-xl drop-shadow-sm")} />
            </div>
            
            <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">
              {feature.title}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);