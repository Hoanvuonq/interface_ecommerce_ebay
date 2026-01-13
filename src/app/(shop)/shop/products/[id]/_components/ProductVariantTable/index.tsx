"use client";

import React, { useMemo } from "react";
import { ShoppingCart, FileText } from "lucide-react";
import { DataTable } from "@/components";
import { getVariantColumns } from "./columns";

interface ProductVariantTableProps {
  variantRows: any[];
  optionNames: string[];
  onOpenManage: () => void;
}

export const ProductVariantTable = ({
  variantRows,
  optionNames,
  onOpenManage,
}: ProductVariantTableProps) => {
  
  const columns = useMemo(() => getVariantColumns(optionNames), [optionNames]);

  const header = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
          <ShoppingCart size={20} />
        </div>
        <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">
          Biến thể sản phẩm
        </h2>
      </div>
      <button
        onClick={onOpenManage}
        className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all shadow-sm active:scale-95"
      >
        <FileText size={14} /> Quản lý hàng loạt
      </button>
    </div>
  );

  return (
    <div className="w-full">
      <DataTable
        data={variantRows}
        columns={columns}
        loading={false} 
        rowKey="rowKey"
        headerContent={header}
        emptyMessage="Chưa có biến thể nào được tạo."
        page={0}
        size={variantRows.length || 10}
        totalElements={variantRows.length}
        onPageChange={() => {}}
      />
    </div>
  );
};