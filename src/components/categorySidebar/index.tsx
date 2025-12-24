'use client';

import { CategoryService } from '@/services/categories/category.service';
import type { CategoryResponse } from '@/types/categories/category.detail';
import { LayoutGrid } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomCollapseItem } from '../collapseItem';
import { SectionLoading } from '../loading';

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