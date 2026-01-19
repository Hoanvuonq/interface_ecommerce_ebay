"use client";

import React from "react";
import { ProductResponse } from "../../../_types/dto/product.dto";
import Link from "next/link";
import { ExternalLink, Tag, Store, Fingerprint, Coins } from "lucide-react";
import { cn } from "@/utils/cn";

interface ProductSummaryCardProps {
  product: ProductResponse;
}

export const ProductSummaryCard =({
  product,
}: ProductSummaryCardProps) =>{
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl shadow-sm">
            Chờ duyệt
          </span>
        );
      case "APPROVED":
        return (
          <span className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl shadow-sm">
            Đã duyệt
          </span>
        );
      case "REJECTED":
        return (
          <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl shadow-sm">
            Từ chối
          </span>
        );
      default:
        return (
          <span className="bg-gray-50 text-gray-600 border border-gray-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl shadow-sm">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-custom-lg border border-orange-50 relative overflow-hidden group transition-all duration-500 hover:shadow-orange-500/10 hover:border-orange-100">
      {/* Nền trang trí chuẩn Web3 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-500/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          {getStatusBadge(product.approvalStatus)}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
            <Fingerprint size={12} className="text-slate-400" />
            <span className="text-[10px] text-slate-500 font-bold tracking-tighter uppercase">
              ID: {product.id.substring(0, 8)}
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight uppercase italic tracking-tighter group-hover:text-orange-600 transition-colors">
          {product.name}
        </h1>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
            <Coins size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] leading-none mb-1">
              Giá niêm yết
            </span>
            <span className="text-4xl font-black text-slate-900 tracking-tighter italic">
              {product.basePrice?.toLocaleString("vi-VN")}
              <span className="text-xl ml-1">₫</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-6 border-t border-slate-50">
          {/* Category Section */}
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-3xl border border-slate-100 group/item hover:bg-white hover:border-orange-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm group-hover/item:text-orange-500 transition-colors">
                <Tag size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Phân loại
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {product.category?.name || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Shop Section */}
          <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-3xl border border-slate-100 group/item hover:bg-white hover:border-orange-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm group-hover/item:text-orange-500 transition-colors">
                <Store size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Cửa hàng
                </p>
                <Link
                  href="#"
                  className="text-sm font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 group-hover/item:underline underline-offset-4"
                >
                  {product.shop?.name || "Shop Owner"}
                  <ExternalLink size={12} strokeWidth={3} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slug Metadata */}
        <div className="mt-6 flex items-center gap-2 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
            Asset: /{product.slug}
          </span>
        </div>
      </div>
    </div>
  );
}
