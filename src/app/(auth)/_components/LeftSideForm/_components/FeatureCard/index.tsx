"use client";

import React from "react";

export interface FeatureCardProps {
  icon: React.ElementType;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  iconColor,
  gradientFrom,
  gradientTo,
  title,
  description,
}) => (
  <div className="flex items-center cursor-pointer gap-4 p-5 rounded-2xl border border-gray-200 dark:border-slate-600 bg-white/80 dark:bg-slate-900/80 shadow-md hover:shadow-xl transition-all duration-300 group">
    <div
      className={`w-14 h-14 ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-800 group-hover:scale-105 transition-transform duration-200 shadow`}
    >
      <Icon className={`${iconColor} text-2xl drop-shadow`} />
    </div>
    <div>
      <span className="text-lg font-bold block text-gray-800! dark:text-gray-100! mb-1">
        {title}
      </span>
      <span className="text-sm text-gray-800! dark:text-gray-100! leading-snug block">
        {description}
      </span>
    </div>
  </div>
);