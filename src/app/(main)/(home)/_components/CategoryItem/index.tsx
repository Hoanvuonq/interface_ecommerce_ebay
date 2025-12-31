import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { categoryIcons } from "../../_types/categories";
import { resolveVariantImageUrl } from "@/utils/products/media.helpers";

export const CategoryItem = (
  category: CategoryResponse,
  index: number,
  isMobile = false
) => {
  return (
    <Link
      key={`${isMobile ? "m" : "p"}-${category.id}-${index}`}
      href={`/category/${category.slug}`}
      className={cn(
        "group/item flex flex-col items-center gap-1 transition-all duration-300",
        isMobile ? "w-16 shrink-0 snap-center pb-1" : "w-full py-1"
      )}
    >
      <div
        className={cn(
          "relative w-11 h-11 flex items-center justify-center overflow-hidden rounded-2xl",
          "border border-orange-50 shadow-sm bg-white group-hover/item:-translate-y-1",
          "group-hover/item:border-orange-200 group-hover/item:shadow-md transition-all duration-300"
        )}
      >
        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-orange-50/30 pointer-events-none z-10" />
        <div className="w-full h-full p-2 flex items-center justify-center transition-transform duration-500 group-hover/item:scale-110">
          {category.imageBasePath ? (
            <Image
              src={resolveVariantImageUrl(
                {
                  imageBasePath: category.imageBasePath,
                  imageExtension: category.imageExtension!,
                },
                "_thumb"
              )}
              alt={category.name}
              width={44}
              height={44}
              className="object-contain w-full h-full"
            />
          ) : (
            <span className="text-xl">
              {categoryIcons[category.name.toLowerCase()] || "🛍️"}
            </span>
          )}
        </div>
      </div>
      <p className="text-[9px] sm:text-[10px] font-bold uppercase text-center leading-tight line-clamp-2 h-6 px-0.5 text-slate-500 group-hover/item:text-orange-600 transition-colors">
        {category.name}
      </p>
    </Link>
  );
};
