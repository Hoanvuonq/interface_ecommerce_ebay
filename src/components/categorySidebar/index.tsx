'use client';

import { CategoryService } from '@/services/categories/category.service';
import type { CategoryResponse } from '@/types/categories/category.detail';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CustomSpinner } from '../customSpinner';
import { cn } from '@/utils/cn';
import { ChevronDown, List } from 'lucide-react'; // Import Lucide icons

const CustomCollapseItem: React.FC<{ category: CategoryResponse }> = ({ category }) => {
    const hasChildren = category.children && category.children.length > 0;

    if (!hasChildren) {
        return (
            <Link
                href={`/category/${category.slug}`}
                className="block py-2 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded-lg"
            >
                {category.name}
            </Link>
        );
    }

    return (
        <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-2 px-3 hover:bg-gray-50 transition-colors rounded-lg">
                <Link
                    href={`/category/${category.slug}`}
                    onClick={(e) => e.stopPropagation()} 
                    className="text-sm font-medium text-gray-800 hover:text-blue-600 flex-1 min-w-0"
                >
                    {category.name}
                </Link>
                <div className="flex-shrink-0 ml-2">
                    <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200 group-open:rotate-180" />
                </div>
            </summary>
            
            <div className="pl-4 py-1 space-y-1 border-l border-gray-200 ml-3">
                {(category.children || []).map((ch) => (
                    <div key={ch.id}>
                        <Link
                            href={`/category/${ch.slug}`}
                            className="text-sm  text-gray-600 hover:text-blue-600 block py-1 px-2 hover:bg-gray-50 transition-colors rounded-lg"
                        >
                            {ch.name}
                        </Link>
                    </div>
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
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sticky top-20 min-h-[200px] flex justify-center items-center">
                <CustomSpinner />
            </div>
        );
    }

    return (
        <div 
            className="rounded-xl shadow-lg border border-gray-100 bg-white  top-20 overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100">
                <List className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-black uppercase">Tất Cả Danh Mục</h3>
            </div>
            
            <div className="p-2 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
                {categories.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        Không có danh mục nào.
                    </div>
                ) : (
                    categories.map((c) => (
                        <CustomCollapseItem key={c.id} category={c} />
                    ))
                )}
            </div>
        </div>
    );
}