"use client";

import React from "react";
import {
  Eye,
  ExternalLink,
  Image as ImageIcon,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { cn } from "@/utils/cn";

interface ProductDetailHeaderProps {
  product: UserProductDTO;
  getStatusBadge: (status: any, active: boolean) => React.ReactNode;
  onOpenMedia: () => void;
  onOpenManage: () => void;
}

export const ProductDetailHeader = ({
  product,
  getStatusBadge,
  onOpenMedia,
  onOpenManage,
}: ProductDetailHeaderProps) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-30 py-4 bg-gray-50/80 backdrop-blur-md">
      <div className="bg-white rounded-4xl shadow-custom p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-gray-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all duration-300 group active:scale-90 border border-gray-100"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-800 tracking-tight uppercase">
                {product.name}
              </h1>
              <div className="hidden sm:flex gap-2">
                {getStatusBadge(product.approvalStatus, product.active)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                ID: {product.id}
              </span>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest hidden md:inline">
                • SLUG:{" "}
                <span className="text-gray-500 font-mono lowercase tracking-normal">
                  {product.slug}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-[1.25rem] border border-gray-100">
            {product.id && (
              <a
                href={`/shop/products/${product.id}/preview`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white text-amber-600 hover:text-amber-700 rounded-xl transition-all font-bold text-[11px] uppercase tracking-wider shadow-xs border border-gray-100 active:scale-95 whitespace-nowrap"
              >
                <Eye size={14} />
                Xem trước
              </a>
            )}

            {product.slug &&
              product.approvalStatus === "APPROVED" &&
              product.active && (
                <a
                  href={`/products/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:text-blue-700 rounded-xl transition-all font-bold text-[11px] uppercase tracking-wider shadow-xs border border-gray-100 active:scale-95 whitespace-nowrap"
                >
                  <ExternalLink size={14} />
                  Bán lẻ
                </a>
              )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMedia}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-orange-600 rounded-xl transition-all font-bold text-[11px] uppercase tracking-wider shadow-sm active:scale-95 whitespace-nowrap"
            >
              <ImageIcon size={16} />
              Media
            </button>

            <button
              onClick={onOpenManage}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white hover:bg-orange-600 rounded-xl transition-all font-bold text-[11px] uppercase tracking-wider shadow-lg shadow-orange-200 active:scale-95 whitespace-nowrap"
            >
              <FileText size={16} />
              Biến thể
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
