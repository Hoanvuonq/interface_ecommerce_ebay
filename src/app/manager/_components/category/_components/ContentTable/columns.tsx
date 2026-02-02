import React from "react";
import Image from "next/image";
import { Folder, Eye, Edit3, Trash2, Image as ImageIcon } from "lucide-react";
import { CategoryResponse } from "@/types/categories/category.detail";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";

export const getCategoryColumns = (
  onView: (cat: CategoryResponse) => void,
  onEdit: (cat: CategoryResponse) => void,
  onDelete: (cat: CategoryResponse) => void,
): Column<CategoryResponse>[] => [
  {
    header: "Visual",
    align: "center",
    render: (category) => {
      const displayUrl = category.imagePath
        ? toPublicUrl(category.imagePath.replace("*", "orig"))
        : null;

      return (
        <div className="w-14 h-14 rounded-2xl border-2 border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center group-hover:border-orange-200 transition-all shadow-sm relative">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={category.name}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <ImageIcon className="text-gray-400 w-6 h-6" />
          )}
        </div>
      );
    },
  },
  {
    header: "Metadata",
    render: (category) => (
      <div className="space-y-1">
        <div className="text-sm font-bold text-gray-800 tracking-tight group-hover:text-orange-600 transition-colors uppercase">
          {category.name}
        </div>
        {category.parent && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold uppercase tracking-tighter border border-blue-100">
            <Folder size={10} /> {category.parent.name}
          </div>
        )}
      </div>
    ),
  },
  {
    header: "Slug Hash",
    render: (category) => (
      <code className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-100">
        /{category.slug}
      </code>
    ),
  },
  {
    header: "State",
    align: "center",
    render: (category) => (
      <span
        className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
          category.active
            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
            : "bg-rose-50 text-rose-600 border-rose-100",
        )}
      >
        {category.active ? "● Active" : "○ Inactive"}
      </span>
    ),
  },
  {
    header: "Actions",
    align: "right",
    render: (category) => (
      <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onView(category)}
          className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-xs active:scale-90"
        >
          <Eye size={18} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => onEdit(category)}
          className="p-2.5 text-gray-500 hover:text-orange-600 hover:bg-white rounded-xl transition-all shadow-xs active:scale-90"
        >
          <Edit3 size={18} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => onDelete(category)}
          className="p-2.5 text-gray-500 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-xs active:scale-90"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </div>
    ),
  },
];
