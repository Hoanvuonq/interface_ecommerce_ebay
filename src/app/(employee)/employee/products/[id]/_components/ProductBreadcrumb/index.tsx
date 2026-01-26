import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";

interface ProductBreadcrumbProps {
  productId: string;
}

export const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({
  productId,
}) => {
  return (
    <div className="flex items-center gap-4 py-2">
      <Link
        href="/employee/products"
        className="group relative flex items-center justify-center w-11 h-11 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-orange-200 hover:bg-orange-50 transition-all duration-300"
        title="Quay lại danh sách"
      >
        <ArrowLeft
          size={20}
          strokeWidth={2.5}
          className="text-gray-500 group-hover:text-orange-600 group-hover:-translate-x-1 transition-transform duration-300"
        />
      </Link>

      <div className="h-6 w-[1.5px] bg-linear-to-b from-transparent via-gray-200 to-transparent" />

      <div className="hidden md:block">
        <nav className="flex items-center gap-3">
          <Link
            href="/employee"
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-orange-600 transition-colors"
          >
            <Home size={13} />
            Admin
          </Link>

          <ChevronRight size={14} className="text-gray-300 stroke-3" />

          <Link
            href="/employee/products"
            className="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-orange-600 transition-colors"
          >
            Catalog
          </Link>

          <ChevronRight size={14} className="text-gray-300 stroke-3" />

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 border border-slate-200 rounded-lg backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-slate-700 tracking-tight">
              PROD-#{productId.substring(0, 8).toUpperCase()}
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
};
