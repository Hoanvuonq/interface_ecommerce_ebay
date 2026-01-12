// components/categorySidebar/collapseItem.tsx
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface Props {
  category: CategoryResponse;
  activeId?: string;
  onSelect?: (id: string) => void;
}

export const CustomCollapseItem: React.FC<Props> = ({
  category,
  activeId,
  onSelect,
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = activeId === category.id || category.children?.some(ch => ch.id === activeId);

  const baseItemClass = cn(
    "w-full flex items-center justify-between cursor-pointer py-2.5 px-3.5 text-[12px] font-bold uppercase tracking-tight transition-all duration-200 rounded-xl group/item",
    activeId === category.id 
      ? "bg-orange-50 text-orange-600 shadow-sm" 
      : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
  );

  const handleItemClick = (e: React.MouseEvent, id: string) => {
    if (onSelect) {
      e.preventDefault(); 
      onSelect(id);
    }
  };

  const renderContent = (id: string, name: string, isParent = false) => (
    <div 
      className={isParent ? baseItemClass : cn(
        "w-full text-left text-[13px] font-medium block py-1.5 px-3 rounded-lg transition-colors",
        activeId === id ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:text-orange-600 hover:bg-orange-50/50"
      )}
      onClick={(e) => handleItemClick(e, id)}
    >
      <span className="truncate">{name}</span>
    </div>
  );

  if (!hasChildren) {
    return (
      <Link href={`/category/${category.slug}`} onClick={(e) => handleItemClick(e, category.id)}>
        {renderContent(category.id, category.name, true)}
      </Link>
    );
  }

  return (
    <details className="group mb-1" open={isSelected}>
      <summary className="list-none outline-none">
        <Link 
          href={`/category/${category.slug}`} 
          className={baseItemClass}
          onClick={(e) => handleItemClick(e, category.id)}
        >
          <span className="flex-1 truncate mr-2 text-left">{category.name}</span>
          <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-open:rotate-180" />
        </Link>
      </summary>

      <div className="pl-4 mt-1 space-y-1 border-l-2 border-orange-100 ml-5 animate-in fade-in slide-in-from-top-1">
        {category.children?.map((ch) => (
          <Link 
            key={ch.id} 
            href={`/category/${ch.slug}`}
            onClick={(e) => handleItemClick(e, ch.id)}
          >
            {renderContent(ch.id, ch.name)}
          </Link>
        ))}
      </div>
    </details>
  );
};