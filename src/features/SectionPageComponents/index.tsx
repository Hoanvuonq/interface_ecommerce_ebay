"use client";

import React from "react";
import { CustomBreadcrumb, SectionLoading } from "@/components";
import PageContentTransition from "@/features/PageContentTransition";
import { cn } from "@/utils/cn";

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface ISectionPageComponents {
  children: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  loading?: boolean;
  loadingMessage?: string;
  className?: string;
  background?: string;
}

export const SectionPageComponents: React.FC<ISectionPageComponents> = ({
  children,
  breadcrumbItems,
  loading = false,
  loadingMessage = "Đang tải dữ liệu...",
  className,
  background = "bg-[#f8f9fa]",
}) => {
  if (loading) {
    return (
      <div className={cn("min-h-screen", background)}>
        <SectionLoading size="lg" message={loadingMessage} className="min-h-screen" />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen font-sans text-gray-900", background)}>
      <PageContentTransition>
        <main
          className={cn(
            "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-18 lg:pb-12",
            className
          )}
        >
          {breadcrumbItems && breadcrumbItems.length > 0 && (
            <CustomBreadcrumb items={breadcrumbItems} />
          )}

          {children}
        </main>
      </PageContentTransition>
    </div>
  );
};
