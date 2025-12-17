'use client';

import { ChevronRight, Menu } from 'lucide-react';
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
        <div className="text-sm">
            <div className="mb-3 flex items-center gap-2 pb-3 border-b border-gray-200">
                <Menu size={16} className="text-gray-600" />
                <h3 className="font-medium text-gray-900">Danh Mục</h3>
            </div>

            {currentCategory && (
                <div className="mb-2">
                    <div className="flex items-center gap-1 py-1.5 text-[#ee4d2d] font-medium">
                        <ChevronRight size={14} />
                        <span>{currentCategory.name}</span>
                    </div>
                </div>
            )}

            {/* Children Categories (like Shopee's subcategories) */}
            {visibleChildren.length > 0 && (
                <div className="space-y-1.5">
                    {visibleChildren.map((child) => {
                        const isActive = child.slug.toLowerCase() === currentSlug.toLowerCase();
                        return (
                            <Link
                                key={child.id}
                                href={`/category/${encodeURIComponent(child.slug)}`}
                                className={`block py-1.5 px-2 rounded transition-colors ${isActive
                                        ? 'bg-[#fff5f2] text-[#ee4d2d] font-medium'
                                        : 'text-gray-700 hover:text-[#ee4d2d] hover:bg-gray-50'
                                    }`}
                            >
                                {child.name}
                            </Link>
                        );
                    })}

                    {hasMore && (
                        <button
                            onClick={() => setShowAllChildren(!showAllChildren)}
                            className="w-full py-1.5 px-2 text-left text-gray-600 hover:text-[#ee4d2d] transition-colors flex items-center justify-between"
                        >
                            <span className="font-medium">{showAllChildren ? 'Thu gọn' : 'Thêm'}</span>
                            <ChevronRight
                                size={14}
                                className={`transition-transform ${showAllChildren ? 'rotate-90' : ''}`}
                            />
                        </button>
                    )}
                </div>
            )}

            {/* Show "All Categories" link to go back to root */}
            {currentCategory && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-[#ee4d2d] text-xs flex items-center gap-1"
                    >
                        <ChevronRight size={12} className="rotate-180" />
                        Tất cả Danh mục
                    </Link>
                </div>
            )}
        </div>
    );
}
