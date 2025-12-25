"use client";
import {
  CURATED_KEYWORDS,
  ICON_BG_COLORS,
  REJECTED_KEYWORDS,
  categoryIcons,
  getStandardizedKey,
} from "@/app/(home)/_types/categories";
import { SectionLoading } from "@/components";
import ScrollReveal from "@/features/ScrollReveal";
import { CategoryService } from "@/services/categories/category.service";
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const CategoryImage: React.FC<{
  category: CategoryResponse;
  imageUrl: string;
  getIcon: (name: string) => string;
}> = ({ category, imageUrl, getIcon }) => {
  const [imageError, setImageError] = useState(false);

  if (!imageUrl || imageError) {
    return (
      <span
        className="transition-transform duration-500 group-hover/item:scale-110"
        style={{ fontSize: "1.75rem", lineHeight: "1" }} // Nhỏ gọn hơn
      >
        {getIcon(category.name)}
      </span>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={category.name}
      width={60} 
      height={60}
      className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
      onError={() => setImageError(true)}
    />
  );
};

export const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(20); // Tăng số lượng item mỗi trang
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await CategoryService.getAllParents();
        const data = response?.data || response;
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    const key = categoryName?.toLowerCase().trim() || "";
    if (categoryIcons[key]) return categoryIcons[key];
    return "🛍️";
  };

  const getCategoryImageUrl = (category: CategoryResponse): string => {
    if (category.imageBasePath && category.imageExtension) {
      return resolveVariantImageUrl(
        { imageBasePath: category.imageBasePath, imageExtension: category.imageExtension },
        "_thumb"
      );
    }
    return "";
  };

  const displayCategories = useMemo(() => {
    return categories.filter(cat => cat.name).slice(0, 40);
  }, [categories]);

  const updatePageSize = () => {
    const width = window.innerWidth;
    if (width >= 1024) setPageSize(20); 
    else if (width >= 768) setPageSize(12);
    else setPageSize(displayCategories.length);
  };

  useEffect(() => {
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, [displayCategories.length]);

  const chunkedPages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < displayCategories.length; i += pageSize) {
      chunks.push(displayCategories.slice(i, i + pageSize));
    }
    return chunks;
  }, [displayCategories, pageSize]);

  if (loading) return <SectionLoading message="Đang tải ..." />;

  const renderCategoryItem = (category: CategoryResponse, index: number, isMobile = false) => {
    const imageUrl = getCategoryImageUrl(category);
    const standardKey = getStandardizedKey(category.name);
    const colors = ICON_BG_COLORS[standardKey] || ICON_BG_COLORS["default"];

    return (
      <Link
        key={`${isMobile ? "m" : "p"}-${category.id}-${index}`}
        href={`/category/${category.slug}`}
        className={cn(
          "group/item flex flex-col items-center justify-start py-2 px-1 transition-all duration-300",
          "hover:bg-gray-50/50 rounded-xl",
          isMobile ? "w-20 shrink-0 snap-start" : "w-full"
        )}
      >
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden mb-2 transition-all duration-300",
            colors.bg,
            "group-hover/item:shadow-md group-hover/item:rounded-full",
            !imageUrl && colors.text
          )}
        >
          <CategoryImage category={category} imageUrl={imageUrl} getIcon={getCategoryIcon} />
        </div>
        <p className="text-[11px] font-bold text-gray-600 text-center leading-tight line-clamp-2 h-7 group-hover/item:text-orange-500">
          {category.name}
        </p>
      </Link>
    );
  };

  return (
    <section className="bg-(--color-bg-soft) py-6">
      <ScrollReveal animation="slideUp">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            <div className="flex sm:hidden overflow-x-auto gap-1 pb-4 snap-x scrollbar-hide">
              {displayCategories.map((cat, idx) => renderCategoryItem(cat, idx, true))}
            </div>

            <div className="hidden sm:block">
              <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-1 gap-y-1">
                {chunkedPages[currentPage]?.map((cat, idx) => renderCategoryItem(cat, idx))}
              </div>

              {chunkedPages.length > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
                    disabled={currentPage === 0}
                    className="p-1.5 rounded-full border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1.5">
                    {chunkedPages.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "h-1 transition-all rounded-full",
                          currentPage === idx ? "w-4 bg-orange-500" : "w-1 bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, chunkedPages.length - 1))}
                    disabled={currentPage === chunkedPages.length - 1}
                    className="p-1.5 rounded-full border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
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