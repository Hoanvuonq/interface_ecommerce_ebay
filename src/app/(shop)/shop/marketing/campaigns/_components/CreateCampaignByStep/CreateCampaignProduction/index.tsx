"use client";

import React, { useMemo } from "react";
import { Layers, RefreshCw } from "lucide-react";
import { DataTable } from "@/components";
import { cn } from "@/utils/cn";
import { getProductSelectionColumns } from "./column";

interface IProductSelectionProps {
  myProducts: any[];
  productsLoading: boolean;
  selectedVariants: any;
  setSelectedVariants: React.Dispatch<React.SetStateAction<any>>;
  onRefreshProducts: () => void;
}

export const CreateCampaignProduction: React.FC<
  IProductSelectionProps
> = ({
  myProducts,
  productsLoading,
  selectedVariants,
  setSelectedVariants,
  onRefreshProducts,
}) => {
  const flatVariants = useMemo(() => {
    if (!myProducts) return [];
    return myProducts
      .filter((p: any) => p?.variants?.length > 0)
      .flatMap((prod: any) =>
        prod.variants.map((v: any) => ({
          ...v,
          productName: prod.name, 
        })),
      );
  }, [myProducts]);

  const columns = useMemo(
    () => getProductSelectionColumns(selectedVariants, setSelectedVariants),
    [selectedVariants, setSelectedVariants],
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg text-orange-500 shadow-sm">
            <Layers size={18} />
          </div>
          <div>
            <span className="font-bold text-sm  text-gray-700 uppercase tracking-tight block">
              Biến thể khả dụng
            </span>
            <p className="text-[10px]  text-gray-400 font-bold uppercase tracking-wider">
              {flatVariants.length} mục được tìm thấy
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefreshProducts}
          className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 hover:bg-slate-100  text-gray-600 rounded-lg border border-slate-200 text-[11px] font-bold transition-all active:scale-95"
        >
          <RefreshCw
            size={12}
            className={cn(productsLoading && "animate-spin")}
          />
          LÀM MỚI
        </button>
      </div>

      {/* Bảng danh sách sản phẩm */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <DataTable
          data={flatVariants}
          columns={columns}
          loading={productsLoading}
          page={0}
          size={flatVariants.length || 10}
          totalElements={flatVariants.length}
          onPageChange={() => {}}
          emptyMessage="Không tìm thấy sản phẩm nào trong kho của bạn"
          rowKey={(item: any) => item.id}
        />
      </div>
    </div>
  );
};
