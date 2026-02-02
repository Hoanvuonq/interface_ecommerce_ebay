"use client";

import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { categoryIcons } from "../../_types/categories";

interface CategoryItemProps {
  category: CategoryResponse;
  index: number;
  isMobile?: boolean;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  index,
  isMobile = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const imageUrl = React.useMemo(() => {
    if (!category.imagePath || imgError) return null;
    
    const formattedPath = category.imagePath.replace("*", "orig"); 
    
    return toPublicUrl(formattedPath);
  }, [category.imagePath, imgError]);

  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        "group/item flex flex-col items-center gap-2 transition-all duration-300",
        isMobile ? "w-16 shrink-0 snap-center pb-2" : "w-full py-2"
      )}
    >
      <div
        className={cn(
          "relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center overflow-hidden rounded-2xl",
          "border border-gray-100 shadow-sm bg-white group-hover/item:-translate-y-1",
          "group-hover/item:border-gray-200 group-hover/item:shadow-lg group-hover/item:shadow-orange-500/10 transition-all duration-300"
        )}
      >
        <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover/item:scale-110">
          {imageUrl ? (
            <Image
              src={imageUrl!}
              alt={category.name}
              width={56}
              height={56}
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
              unoptimized={imageUrl?.includes(".svg")}
            />
          ) : (
            <span className="text-2xl sm:text-3xl filter group-hover/item:grayscale-0 transition-all">
              {categoryIcons[category.name.toLowerCase()] || "🛍️"}
            </span>
          )}
        </div>
      </div>

      <p
        className={cn(
          "text-[10px] sm:text-[11px] font-bold text-center line-clamp-2 h-5 px-1 text-gray-600 uppercase",
          "group-hover/item:text-(--color-mainColor) leading-tight transition-colors "
        )}
      >
        {category.name}
      </p>
    </Link>
  );
};
