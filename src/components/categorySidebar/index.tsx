'use client';

import { CategoryService } from '@/services/categories/category.service';
import type { CategoryResponse } from '@/types/categories/category.detail';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, LayoutGrid } from 'lucide-react'; 
import { SectionLoading } from '../loading';

const CustomCollapseItem: React.FC<{ category: CategoryResponse }> = ({ category }) => {
    const hasChildren = category.children && category.children.length > 0;

    const baseItemClass = "flex items-center justify-between py-2.5 px-3.5 text-sm font-bold text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 rounded-xl group/item";

    if (!hasChildren) {
        return (
            <Link
                href={`/category/${category.slug}`}
                className={baseItemClass}
            >
                <span className="truncate">{category.name}</span>
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
                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-300 group-open:rotate-180 group-hover/item:text-orange-500" />
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

export default function CategorySidebar() {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await CategoryService.getAllParents();
                const cats = Array.isArray(res) ? res : (res as { data?: CategoryResponse[] })?.data || [];
                setCategories(cats);
            } catch(e) {
                console.error("Error fetching categories:", e);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <SectionLoading message="Đang tải danh mục..." />
            </div>
        );
    }

    return (
        <div 
            className="rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 bg-white overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
            <div className="p-5 border-b border-orange-50 flex items-center gap-3 bg-linear-to-r from-orange-50 to-amber-50">
                <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-200">
                    <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest leading-none">Danh Mục</h3>
                    <p className="text-[10px] text-orange-600 font-bold mt-1 uppercase tracking-tighter">Khám phá sản phẩm</p>
                </div>
            </div>
            
            {/* Body */}
            <div className="p-3 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {categories.length === 0 ? (
                    <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                           <LayoutGrid size={24} />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Trống</p>
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {categories.map((c) => (
                            <CustomCollapseItem key={c.id} category={c} />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-medium text-center uppercase tracking-widest">
                    Hỗ trợ 24/7
                </p>
            </div>
        </div>
    );
}