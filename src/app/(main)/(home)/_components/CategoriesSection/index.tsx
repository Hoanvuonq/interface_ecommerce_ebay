"use client";

import { SectionLoading } from "@/components";
import { SectionSreen } from "@/features/SectionSreen";
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useHomepageContext } from "../../_context/HomepageContext";
import { CategoryItem } from "../CategoryItem";

export const CategoriesSection: React.FC = () => {
  const { categories, isLoading } = useHomepageContext();
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);

  const displayCategories = useMemo(() => {
    return ((categories as CategoryResponse[]) || [])
      .filter((cat) => cat.name && cat.slug)
      .slice(0, 40);
  }, [categories]);

  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth >= 1280) setPageSize(20);
      else if (window.innerWidth >= 1024) setPageSize(16);
      else if (window.innerWidth >= 768) setPageSize(12);
      else setPageSize(8); 
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

  useEffect(() => { setCurrentPage(0); }, [pageSize]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50; 
    if (info.offset.x < -swipeThreshold && currentPage < chunkedPages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (info.offset.x > swipeThreshold && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isLoading && displayCategories.length === 0)
    return <SectionLoading message="Đang tải danh mục..." />;
  if (!isLoading && displayCategories.length === 0) return null;

  return (
    <SectionSreen isWhite id="categories" animation="slideUp">
      <div className="relative group/section px-2 touch-pan-y"> 
        
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPage}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "grid gap-y-1 gap-x-2 sm:gap-x-4 cursor-grab active:cursor-grabbing",
                "grid-cols-4 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-8"
              )}
            >
              {chunkedPages[currentPage]?.map((cat, idx) => (
                <div key={cat.id || idx} className="flex justify-center select-none">
                   <CategoryItem category={cat} index={idx} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {chunkedPages.length > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-2">
            <div className="flex gap-2 items-center order-2 sm:order-1">
              {chunkedPages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={cn(
                    "h-1.5 transition-all duration-500 rounded-full",
                    currentPage === idx
                      ? "w-10 bg-orange-600 shadow-sm shadow-orange-200"
                      : "w-3 bg-slate-200 hover:bg-slate-300"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionSreen>
  );
};