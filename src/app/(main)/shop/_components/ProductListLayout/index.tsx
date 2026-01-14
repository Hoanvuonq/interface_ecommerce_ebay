"use client";

import { ProductCard } from "@/app/(main)/products/_components";
import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { cn } from "@/utils/cn";
import _ from "lodash";
import {
  ChevronRight,
  LayoutGrid,
  ListFilter,
  Store
} from "lucide-react";
import { SORT_OPTIONS } from "../../_constants/voucher";

interface ProductListLayoutProps {
  products: PublicProductListItemDTO[];
  loading: boolean;
  totalProducts: number;
  currentPage: number;
  pageSize: number;
  searchKeyword: string;
  selectedCategory?: string;
  sortBy: string;
  onSetSortBy: (value: string) => void;
  onClearFilter: () => void;
  onPageChange: (page: number) => void;
}

export default function ProductListLayout({
  products,
  loading,
  totalProducts,
  currentPage,
  pageSize,
  searchKeyword,
  selectedCategory,
  sortBy,
  onSetSortBy,
  onClearFilter,
  onPageChange,
}: ProductListLayoutProps) {
  
  const renderSkeletons = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
      {_.range(8).map((i) => (
        <div
          key={i}
          className="h-80 bg-gray-100 rounded-2xl border border-gray-50"
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-125"> 
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-50 sticky top-24 z-20 transition-all duration-300">
        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          {searchKeyword ? (
            <>
              Kết quả cho "<span className="text-(--color-mainColor)">{searchKeyword}</span>"
            </>
          ) : selectedCategory ? (
            "Sản phẩm theo danh mục"
          ) : (
            <>
              <LayoutGrid size={18} className="text-gray-600" />
              Tất cả sản phẩm
            </>
          )}
          <span className="text-gray-600 font-normal ml-1">
            ({totalProducts})
          </span>
        </h2>

        <div className="flex items-center gap-2 pb-1 md:pb-0 ">
          <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-gray-100 mr-2">
            <ListFilter size={14} className="text-gray-600" />
            <span className="text-xs text-gray-500 font-medium hidden sm:block">
              Sắp xếp:
            </span>
          </div>

          {SORT_OPTIONS.map((option) => {
            const isActive = sortBy === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onSetSortBy(option.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border whitespace-nowrap flex items-center gap-1.5 snap-start shrink-0",
                  isActive
                    ? "bg-(--color-mainColor) text-white border-(--color-mainColor) shadow-md shadow-orange-200 transform scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-(--color-mainColor) hover:text-(--color-mainColor)"
                )}
              >
                {option.label}
                {option.icon && (
                  <span className={isActive ? "text-white" : "text-gray-600"}>
                    {option.icon}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
          renderSkeletons()
        ) : _.isEmpty(products) ? (
          <div className="py-32 flex flex-col items-center justify-center text-gray-600 animate-in fade-in zoom-in duration-500">
            <Store size={64} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="font-medium">Chưa tìm thấy sản phẩm nào</p>
            <button
              onClick={onClearFilter}
              className="mt-4 text-(--color-mainColor) text-sm hover:underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {_.map(products, (p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* FOOTER: Pagination */}
      {/* {!loading && !_.isEmpty(products) && (
        <div className="mt-12 flex justify-center gap-2 pb-10 animate-in fade-in duration-700">
          {_.range(Math.min(5, Math.ceil(totalProducts / pageSize))).map(
            (i) => (
              <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`w-9 h-9 rounded-md text-sm font-bold transition-all ${
                  currentPage === i
                    ? "bg-(--color-mainColor) text-white shadow-lg shadow-orange-200 scale-110"
                    : "bg-white text-gray-500 hover:bg-orange-50 hover:text-(--color-mainColor) border border-gray-100"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
          {Math.ceil(totalProducts / pageSize) > 5 && (
            <span className="w-9 h-9 flex items-center justify-center text-gray-300">
              ...
            </span>
          )}
          <button
            disabled={currentPage >= Math.ceil(totalProducts / pageSize) - 1}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:text-(--color-mainColor) hover:border-gray-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )} */}
    </div>
  );
}