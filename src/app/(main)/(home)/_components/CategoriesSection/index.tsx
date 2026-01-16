"use client";

import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import _ from "lodash";
import { cn } from "@/utils/cn";
import { SectionLoading } from "@/components";
import { SectionSreen } from "@/features/SectionSreen";
import { CategoryItem } from "../CategoryItem";
import { useHomepageContext } from "../../_context/HomepageContext";

const usePageSize = () => {
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setPageSize(20);
      else if (width >= 1024) setPageSize(16);
      else if (width >= 768) setPageSize(12);
      else setPageSize(8);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return pageSize;
};

export const CategoriesSection: React.FC = () => {
  const { categories, isLoading } = useHomepageContext();
  const pageSize = usePageSize();
  const [currentPage, setCurrentPage] = useState(0);

  const chunkedPages = useMemo(() => {
    const validCategories = _.take(
      _.filter(categories, (cat) => !!(cat.name && cat.slug)),
      40
    );
    return _.chunk(validCategories, pageSize);
  }, [categories, pageSize]);

  useEffect(() => setCurrentPage(0), [pageSize]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (
      info.offset.x < -swipeThreshold &&
      currentPage < chunkedPages.length - 1
    ) {
      setCurrentPage((prev) => prev + 1);
    } else if (info.offset.x > swipeThreshold && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading && _.isEmpty(chunkedPages))
    return <SectionLoading message="Đang tải danh mục..." />;

  if (_.isEmpty(chunkedPages)) return null;

  return (
    <SectionSreen isWhite id="categories" animation="slideUp">
      <div className="relative group/section px-2 touch-pan-y">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentPage}-${pageSize}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-4 lg:grid-cols-8 gap-y-1 gap-x-2 sm:gap-x-4 cursor-grab active:cursor-grabbing"
            >
              {chunkedPages[currentPage]?.map((cat, idx) => (
                <div
                  key={cat.id || idx}
                  className="flex justify-center select-none"
                >
                  <CategoryItem category={cat} index={idx} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {chunkedPages.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {chunkedPages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  currentPage === idx ? "w-10 bg-orange-600" : "w-3 bg-gray-200"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </SectionSreen>
  );
};
