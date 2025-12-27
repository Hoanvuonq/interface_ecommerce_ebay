'use client';

import { ChevronDown, ChevronRight, List } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Category {
    id: string;
    name: string;
    slug: string;
    children?: Category[];
}

interface CategoryFilterProps {
    currentCategory: Category | null;
    currentChildren: Category[];
    allCategories: Category[];
    currentSlug: string;
}

export default function CategoryFilter({
    currentCategory,
    currentChildren,
    allCategories,
    currentSlug,
}: CategoryFilterProps) {
    const [showAllChildren, setShowAllChildren] = useState(false);

    const INITIAL_VISIBLE = 6;
    const visibleChildren = showAllChildren
        ? currentChildren
        : currentChildren.slice(0, INITIAL_VISIBLE);
    const hasMore = currentChildren.length > INITIAL_VISIBLE;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50/50 px-4 py-3.5 flex items-center gap-2.5 border-b border-gray-100">
                <List size={18} className="text-gray-700" />
                <h3 className="font-bold text-[15px] text-gray-900 tracking-tight">
                    DANH MỤC
                </h3>
            </div>

            <div className="p-2">
                {/* Active Category Header */}
                {currentCategory && (
                    <div className="px-2 py-2 mb-1">
                        <Link 
                            href={`/category/${encodeURIComponent(currentCategory.slug)}`}
                            className="flex items-start gap-2 group"
                        >
                            <div className="mt-1">
                                <ChevronRight size={14} className="text-[#ee4d2d]" />
                            </div>
                            <span className="font-bold text-[14px] text-[#ee4d2d] leading-tight group-hover:underline">
                                {currentCategory.name}
                            </span>
                        </Link>
                    </div>
                )}

                {/* Children List */}
                <div className="space-y-0.5">
                    {visibleChildren.map((child) => {
                        const isActive = child.slug.toLowerCase() === currentSlug.toLowerCase();
                        return (
                            <Link
                                key={child.id}
                                href={`/category/${encodeURIComponent(child.slug)}`}
                                className={`group flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-200 ${
                                    isActive
                                        ? 'bg-orange-50 text-[#ee4d2d] font-semibold shadow-sm ring-1 ring-orange-100'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-[13.5px] truncate">
                                    {child.name}
                                </span>
                                {isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ee4d2d] shadow-[0_0_8px_rgba(238,77,45,0.5)]" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Show More/Less Button */}
                    {hasMore && (
                        <button
                            onClick={() => setShowAllChildren(!showAllChildren)}
                            className="w-full mt-1 py-2 px-3 text-[13px] font-medium text-gray-500 hover:text-[#ee4d2d] hover:bg-orange-50/50 rounded-lg transition-all flex items-center justify-center gap-1.5 border border-dashed border-gray-200 hover:border-orange-200"
                        >
                            {showAllChildren ? (
                                <>Thu gọn <ChevronDown size={14} className="rotate-180" /></>
                            ) : (
                                <>Xem thêm ({currentChildren.length - INITIAL_VISIBLE}) <ChevronDown size={14} /></>
                            )}
                        </button>
                    )}
                </div>

                {/* Footer Navigation */}
                {currentCategory && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                        >
                            <ChevronRight size={14} className="rotate-180" />
                            Tất cả danh mục
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}