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
  <div className="lg:hidden mt-8 grid grid-cols-2 gap-4">
    {features.map((feature, idx) => {
      const Icon = feature.icon;
      return (
        <div
          key={idx}
          className={cn(
            "backdrop-blur-sm rounded-xl p-4 text-center shadow-md bg-white/80 dark:bg-slate-700/80 hover:shadow-xl transition-shadow duration-300 cursor-pointer",
          )}
        >
          <div
            className={cn(
              "w-10 h-10 bg-gradient-to-br rounded-lg flex items-center justify-center mx-auto mb-2",
              feature.gradientFrom,
              feature.gradientTo
            )}
          >
            <Icon className={cn(feature.iconColor, "text-lg")} />
          </div>
          <span className={cn("text-xs font-medium block text-gray-800 dark:text-gray-100")}> 
            {feature.title}
          </span>
        </div>
      );
    })}
  </div>
);