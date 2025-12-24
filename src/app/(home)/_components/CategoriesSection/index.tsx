"use client";
import {
  CURATED_KEYWORDS,
  ICON_BG_COLORS,
  REJECTED_KEYWORDS,
  categoryIcons,
  getStandardizedKey,
} from "@/app/(home)/_types/categories";
import ScrollReveal from "@/features/ScrollReveal";
import { CategoryService } from "@/services/categories/category.service";
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// --- Components Con ---

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center w-full h-40">
    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
  </div>
);

const CategoryImage: React.FC<{
  category: CategoryResponse;
  imageUrl: string;
  getIcon: (name: string) => string;
}> = ({ category, imageUrl, getIcon }) => {
  const [imageError, setImageError] = useState(false);

  if (!imageUrl || imageError) {
    return (
      <span
        className="transition-transform duration-500 group-hover/item:scale-110 group-hover/item:rotate-3"
        style={{ fontSize: "2.5rem", lineHeight: "1" }}
      >
        {getIcon(category.name)}
      </span>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={category.name}
      width={120}
      height={120}
      className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
      onError={() => setImageError(true)}
    />
  );
};

// --- Main Component ---

export const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(16);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await CategoryService.getAllParents();
        const data =
          response && typeof response === "object" && "data" in (response as any)
            ? (response as any).data
            : response;
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh mục sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    if (!categoryName) return "🛍️";
    const key = categoryName.toLowerCase().trim();
    if (categoryIcons[key]) return categoryIcons[key];
    for (const [iconKey, icon] of Object.entries(categoryIcons)) {
      if (key.includes(iconKey)) return icon;
    }
    return "🛍️";
  };

  const getCategoryImageUrl = (category: CategoryResponse): string => {
    if (category.imageBasePath && category.imageExtension) {
      return resolveVariantImageUrl(
        {
          imageBasePath: category.imageBasePath,
          imageExtension: category.imageExtension,
        },
        "_medium"
      );
    }
    return "";
  };

  const displayCategories = useMemo(() => {
    if (!categories.length) return [];
    const filtered = categories.filter((category) => {
      const name = category.name?.toLowerCase() || "";
      if (!name) return false;
      if (REJECTED_KEYWORDS.some((keyword) => name.includes(keyword)))
        return false;
      return (
        CURATED_KEYWORDS.some((keyword) => name.includes(keyword)) ||
        name.length > 0
      );
    });
    return filtered.slice(0, 48);
  }, [categories]);

  // Logic Responsive PageSize cho Desktop Grid
  const updatePageSize = () => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    if (width >= 1024) setPageSize(16); // Desktop
    else if (width >= 768) setPageSize(12); // Tablet
    else setPageSize(displayCategories.length); // Mobile: Show all in scroll
  };

  useEffect(() => {
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, [displayCategories.length]);

  const chunkedPages = useMemo(() => {
    if (!displayCategories.length) return [];
    const chunks: CategoryResponse[][] = [];
    for (let i = 0; i < displayCategories.length; i += pageSize) {
      chunks.push(displayCategories.slice(i, i + pageSize));
    }
    return chunks;
  }, [displayCategories, pageSize]);

  useEffect(() => {
    if (!chunkedPages.length) setCurrentPage(0);
    else setCurrentPage((prev) => Math.min(prev, chunkedPages.length - 1));
  }, [chunkedPages.length]);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  // Render Item Component (Reuse cho cả Mobile & Desktop)
  const renderCategoryItem = (category: CategoryResponse, index: number, isMobile = false) => {
    const imageUrl = getCategoryImageUrl(category);
    const key = `${isMobile ? "mob" : "pc"}-${category.id}-${index}`;
    const standardKey = getStandardizedKey(category.name);
    const colors = ICON_BG_COLORS[standardKey] || ICON_BG_COLORS["default"];

    return (
      <Link
        key={key}
        href={`/category/${category.slug}`}
        className={cn(
          "group/item flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300",
          "hover:bg-white hover:shadow-lg hover:-translate-y-1 bg-white border border-[var(--color-border-soft)]",
          isMobile 
            ? "w-[110px] h-[140px] shrink-0 snap-start" // Mobile styles
            : "w-full h-[150px]" // Desktop styles
        )}
      >
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300",
            colors.bg,
            "group-hover/item:bg-[var(--color-bg-soft)]", // Đổi màu nền khi hover
            !imageUrl && !category.imageBasePath && colors.text
          )}
        >
          <CategoryImage
            category={category}
            imageUrl={imageUrl}
            getIcon={getCategoryIcon}
          />
        </div>
        <p className="text-sm font-semibold text-gray-700 text-center leading-tight px-1 h-10 line-clamp-2 group-hover/item:text-[var(--color-primary)] transition-colors">
          {category.name}
        </p>
      </Link>
    );
  };

  return (
    <section className="bg-[var(--color-bg-soft)] py-8">
      <ScrollReveal animation="slideUp" delay={150}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pl-2 border-l-4 border-[var(--color-primary)]">
            <h2 className="text-xl font-bold uppercase text-gray-800 tracking-wide">
              Danh Mục Nổi Bật
            </h2>
          </div>

          <div className="relative">
            {displayCategories.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <p className="text-gray-500">Hiện chưa có danh mục nào.</p>
              </div>
            ) : (
              <>
                {/* --- MOBILE VIEW: Horizontal Scroll --- */}
                <div className="flex sm:hidden overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-hide px-1">
                  {displayCategories.map((cat, idx) => renderCategoryItem(cat, idx, true))}
                </div>

                {/* --- DESKTOP VIEW: Grid Pagination --- */}
                <div className="hidden sm:block bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border-soft)]">
                  {chunkedPages[currentPage] && (
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 animate-in fade-in duration-500">
                      {chunkedPages[currentPage].map((cat, idx) => renderCategoryItem(cat, idx, false))}
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {chunkedPages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className={cn(
                          "absolute left-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full",
                          "bg-white border border-gray-100 shadow-xl flex items-center justify-center z-10 transition-all",
                          "hover:scale-110 hover:text-[var(--color-primary)] disabled:opacity-0 disabled:pointer-events-none text-gray-500"
                        )}
                      >
                        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                      </button>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, chunkedPages.length - 1))
                        }
                        disabled={currentPage === chunkedPages.length - 1}
                        className={cn(
                          "absolute right-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full",
                          "bg-white border border-gray-100 shadow-xl flex items-center justify-center z-10 transition-all",
                          "hover:scale-110 hover:text-[var(--color-primary)] disabled:opacity-0 disabled:pointer-events-none text-gray-500"
                        )}
                      >
                        <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                      </button>
                    </>
                  )}

                  {/* Pagination Dots (Optional for aesthetics) */}
                  {chunkedPages.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {chunkedPages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(idx)}
                          className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            currentPage === idx
                              ? "bg-[var(--color-primary)] w-6"
                              : "bg-gray-300 hover:bg-gray-400"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};