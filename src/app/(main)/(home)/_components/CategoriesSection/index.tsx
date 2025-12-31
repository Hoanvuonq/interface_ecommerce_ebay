"use client";

import { SectionLoading } from "@/components";
import { SectionSreen } from "@/features/SectionSreen";
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useHomepageContext } from "../../_context/HomepageContext";
import { CategoryItem } from "../CategoryItem";
export const CategoriesSection: React.FC = () => {
  const { categories, isLoading } = useHomepageContext();

  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);

  const displayCategories = useMemo(() => {
    return ((categories as CategoryResponse[]) || [])
      .filter((cat: CategoryResponse) => cat.name)
      .slice(0, 40);
  }, [categories]);

  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth >= 1024) setPageSize(20);
      else if (window.innerWidth >= 768) setPageSize(12);
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  const chunkedPages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < displayCategories.length; i += pageSize) {
      chunks.push(displayCategories.slice(i, i + pageSize));
    }
    return chunks;
  }, [displayCategories, pageSize]);

  if (isLoading && displayCategories.length === 0)
    return <SectionLoading message="Đang tải danh mục..." />;
  if (!isLoading && displayCategories.length === 0) return null;

  return (
    <SectionSreen isWhite id="categories" animation="slideUp">
      <div className="relative">
        <div className="flex sm:hidden overflow-x-auto gap-4 pb-1 snap-x scroll-smooth scrollbar-none">
          {displayCategories.map((cat, idx) => CategoryItem(cat, idx, true))}
        </div>

        <div className="hidden sm:block">
          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-y-2 gap-x-2">
            {chunkedPages[currentPage]?.map((cat, idx) =>
              CategoryItem(cat, idx)
            )}
          </div>

          {chunkedPages.length > 1 && (
            <div className="flex justify-center items-center gap-4 mt-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                disabled={currentPage === 0}
                className="p-1 rounded-lg border border-gray-100 disabled:opacity-20 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {chunkedPages.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1 transition-all duration-300 rounded-full",
                      currentPage === idx
                        ? "w-6 bg-orange-600"
                        : "w-1.5 bg-gray-200"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, chunkedPages.length - 1)
                  )
                }
                disabled={currentPage === chunkedPages.length - 1}
                className="p-1 rounded-lg border border-gray-100 disabled:opacity-20 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </SectionSreen>
  );
};
