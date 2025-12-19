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
import { ChevronLeft, ChevronRight, LayoutGrid, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center w-full h-24">
    <Loader2 className="w-8 h-8 animate-spin text-(--color-primary)]" />
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
        className="transition-transform duration-300 group-hover/item:scale-110"
        style={{
          fontSize: "2rem",
          lineHeight: "1",
        }}
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
      className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
      onError={() => setImageError(true)}
    />
  );
};

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
          response &&
          typeof response === "object" &&
          "data" in (response as any)
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

    if (categoryIcons[key]) {
      return categoryIcons[key];
    }

    for (const [iconKey, icon] of Object.entries(categoryIcons)) {
      if (key.includes(iconKey)) {
        return icon;
      }
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
      if (REJECTED_KEYWORDS.some((keyword) => name.includes(keyword))) {
        return false;
      }
      return (
        CURATED_KEYWORDS.some((keyword) => name.includes(keyword)) ||
        name.length > 0
      );
    });

    return filtered.slice(0, 48);
  }, [categories]);

  const updatePageSize = () => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    if (width >= 1024) {
      setPageSize(16);
    } else if (width >= 768) {
      setPageSize(12);
    } else {
      setPageSize(6);
    }
  };

  useEffect(() => {
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  const chunkedPages = useMemo(() => {
    if (!displayCategories.length) return [];
    const chunks: CategoryResponse[][] = [];
    for (let i = 0; i < displayCategories.length; i += pageSize) {
      chunks.push(displayCategories.slice(i, i + pageSize));
    }
    return chunks;
  }, [displayCategories, pageSize]);

  useEffect(() => {
    if (!chunkedPages.length) {
      setCurrentPage(0);
    } else {
      setCurrentPage((prev) => Math.min(prev, chunkedPages.length - 1));
    }
  }, [chunkedPages.length]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Đang tải danh mục...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-(--color-bg-soft) py-10">
      <ScrollReveal animation="slideUp" delay={150}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex items-center gap-2 mb-5">
            <LayoutGrid className="w-6 h-6 text-(--color-primary)" />
            <h2 className="text-lg font-bold uppercase text-gray-800 mb-0">
              Khám phá theo danh mục
            </h2>
          </div>

          <div className="relative bg-white rounded-2xl border border-(--color-border-soft) shadow-sm p-5">
            {chunkedPages.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">
                Hiện chưa có danh mục nào.
              </p>
            ) : (
              <div className="relative">
                {chunkedPages[currentPage] && (
                  <div
                    key={`category-page-${currentPage}`}
                    className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 grid-rows-2 gap-4"
                  >
                    {chunkedPages[currentPage].map((category, index) => {
                      const imageUrl = getCategoryImageUrl(category);
                      const key = `${
                        category.id ??
                        category.slug ??
                        `category-${currentPage}-${index}`
                      }-${index}`;

                      const standardKey = getStandardizedKey(category.name);
                      const colors =
                        ICON_BG_COLORS[standardKey] ||
                        ICON_BG_COLORS["default"];

                      const linkClasses = cn(
                        "flex flex-col items-center justify-start w-[130px] h-[140px] bg-white rounded-lg",
                        "border border-(--color-border-soft) p-3 transition-transform duration-200",
                        "hover:-translate-y-1 hover:shadow-md mx-auto group/item"
                      );

                      const imageWrapperClasses = cn(
                        "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shrink-0 mb-2",
                        "border border-(--color-border-soft)]",
                        colors.bg,
                        !imageUrl && !category.imageBasePath && colors.text
                      );

                      return (
                        <Link
                          key={key}
                          href={`/category/${category.slug}`}
                          className={linkClasses}
                        >
                          <div className={imageWrapperClasses}>
                            <CategoryImage
                              category={category}
                              imageUrl={imageUrl}
                              getIcon={getCategoryIcon}
                            />
                          </div>
                          <p className="text-sm font-medium text-gray-800 text-center mt-0 leading-tight px-1 h-10 line-clamp-2">
                            {category.name}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {currentPage > 0 && (
                  <button
                    type="button"
                    aria-label="Danh mục trước"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 0))
                    }
                    className={cn(
                      "absolute left-4.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full",
                      "bg-white border border-(--color-border-soft) shadow",
                      "hover:bg-(--color-bg-soft) flex items-center justify-center z-10"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5 text-(--color-primary)]" />
                  </button>
                )}

                {currentPage < chunkedPages.length - 1 && (
                  <button
                    type="button"
                    aria-label="Danh mục tiếp theo"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, chunkedPages.length - 1)
                      )
                    }
                    className={cn(
                      "absolute right-4.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full",
                      "bg-white border border-(--color-border-soft) shadow",
                      "hover:bg-(--color-bg-soft) flex items-center justify-center z-10"
                    )}
                  >
                    <ChevronRight className="w-5 h-5 text-(--color-primary)]" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
