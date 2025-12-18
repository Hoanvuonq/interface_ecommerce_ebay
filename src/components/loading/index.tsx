"use client";

import React from "react";
import { CustomSpinner } from "@/components";

interface SectionLoadingProps {
  message?: string;
  className?: string;
}

export const SectionLoading: React.FC<SectionLoadingProps> = ({
  message = "Đang tải dữ liệu...",
  className = ""
}) => {
  return (
    <section className={`py-8 bg-linear-to-br from-(--color-gradient-1) via-white to-(--color-gradient-2) ${className}`}>
      <div className="max-w-7xl mx-auto px-4 text-center py-12">
        <CustomSpinner />
        <p className="mt-4 text-(--color-primary) font-semibold animate-pulse">
          {message}
        </p>
      </div>
    </section>
  );
};