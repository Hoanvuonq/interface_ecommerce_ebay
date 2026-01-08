import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export const CustomCollapseItem: React.FC<{ category: CategoryResponse }> = ({
  category,
}) => {
  const hasChildren = category.children && category.children.length > 0;

  const baseItemClass =
    "flex items-center justify-between cursor-pointer py-2.5 px-3.5 text-sm font-bold text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 rounded-xl group/item";

  if (!hasChildren) {
    return (
      <Link href={`/category/${category.slug}`} className={baseItemClass}>
        <span className="truncate text-[12px]">{category.name}</span>
      </Link>
    );
  }

  return (
    <details className="group mb-1">
      <summary className={cn(baseItemClass, "cursor-pointer list-none")}>
        <Link
          href={`/category/${category.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 truncate mr-2"
        >
          {category.name}
        </Link>
        <ChevronDown className="w-4 h-4 text-gray-600 transition-transform duration-300 group-open:rotate-180 group-hover/item:text-orange-500" />
      </summary>

      <div className="pl-4 mt-1 space-y-1 border-l-2 border-orange-100 ml-5 animate-in fade-in slide-in-from-top-1 duration-200">
        {(category.children || []).map((ch) => (
          <Link
            key={ch.id}
            href={`/category/${ch.slug}`}
            className="text-[13px] font-medium text-gray-500 hover:text-orange-600 block py-1.5 px-3 hover:bg-orange-50/50 transition-colors rounded-lg"
          >
            {ch.name}
          </Link>
        ))}
      </div>
    </details>
  );
};
