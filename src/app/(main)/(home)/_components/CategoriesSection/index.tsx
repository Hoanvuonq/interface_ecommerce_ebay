"use client";
import { ICON_BG_COLORS, categoryIcons, getStandardizedKey } from "@/app/(main)/(home)/_types/categories";
import { SectionLoading } from "@/components";
import ScrollReveal from "@/features/ScrollReveal";
import { useToast } from "@/hooks/useToast";
import { CategoryService } from "@/services/categories/category.service";
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

export const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const { error } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await CategoryService.getAllParents();
        const data = response?.data || response;
        setCategories(Array.isArray(data) ? data : []);
      } catch (e: any) {
        error("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const displayCategories = useMemo(() => {
    return categories.filter((cat) => cat.name).slice(0, 40);
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

  if (loading) return <SectionLoading message="Đang tải danh mục..." />;

  const renderCategoryItem = (category: CategoryResponse, index: number, isMobile = false) => {
    const standardKey = getStandardizedKey(category.name);
    const colors = ICON_BG_COLORS[standardKey] || ICON_BG_COLORS["default"];
    const activeColor = "#FF5F17";

    return (
      <Link
        key={`${isMobile ? "m" : "p"}-${category.id}-${index}`}
        prefetch={false}
        href={`/category/${category.slug}`}
        className={cn(
          "group/item flex flex-col items-center gap-2 transition-all duration-300",
          isMobile ? "w-22 shrink-0 snap-center pb-2" : "w-full py-2"
        )}
      >
        <div
          className={cn(
            "relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden transition-all duration-500",
            "rounded-[1.4rem] border-2 border-white shadow-sm bg-white",
            "group-hover/item:-translate-y-1.5 group-hover/item:shadow-lg",
          )}
          style={{
             boxShadow: `0 4px 10px rgba(0,0,0,0.03), inset 0 -3px 6px rgba(0,0,0,0.02)`
          }}
        >
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/30 to-white/60 pointer-events-none z-10" />
          
          <div className={cn("w-full h-full p-2 flex items-center justify-center transition-transform duration-500 group-hover/item:scale-110")}>
             {category.imageBasePath ? (
                 <Image
                    src={resolveVariantImageUrl({ imageBasePath: category.imageBasePath, imageExtension: category.imageExtension! }, "_thumb")}
                    alt={category.name}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                 />
             ) : (
                <span className="text-3xl">{categoryIcons[category.name.toLowerCase()] || "🛍️"}</span>
             )}
          </div>
        </div>

        <p className={cn(
            "text-[10px] sm:text-[11px] font-bold uppercase text-center leading-tight line-clamp-2 h-7 px-1 duration-300 ",
            "text-gray-700 group-hover/item:text-orange-600 tracking-tighter sm:tracking-normal"
        )}>
          {category.name}
        </p>
      </Link>
    );
  };

  return (
    <section className="bg-gray-50 py-8">
      <ScrollReveal animation="slideUp" delay={150}>
        <div className="max-w-7xl  mx-auto px-4">
          <div className="relative">
            <div className="flex sm:hidden overflow-x-auto gap-2 pb-6 snap-x scroll-smooth scrollbar-pretty">
              {displayCategories.map((cat, idx) => renderCategoryItem(cat, idx, true))}
            </div>

            <div className="hidden sm:block">
              <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-2">
                {chunkedPages[currentPage]?.map((cat, idx) => renderCategoryItem(cat, idx))}
              </div>

              {chunkedPages.length > 1 && (
                <div className="flex justify-center items-center gap-6 mt-8">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-xl border border-gray-100 disabled:opacity-20 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex gap-2">
                    {chunkedPages.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "h-1.5 transition-all duration-300 rounded-full",
                          currentPage === idx ? "w-8 bg-orange-500 shadow-[0_2px_10px_rgba(249,115,22,0.4)]" : "w-2 bg-gray-200"
                        )}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, chunkedPages.length - 1))}
                    disabled={currentPage === chunkedPages.length - 1}
                    className="p-2 rounded-xl border border-gray-100 disabled:opacity-20 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};