"use client";

import { 
  Building2, Tag, DollarSign, Box, Ruler, 
  Weight, Trash2, Store, Banknote, ShieldCheck, 
  Package
} from "lucide-react";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { cn } from "@/utils/cn";

interface ProductSidebarProps {
  product: UserProductDTO;
  actionLoading: boolean;
  onDelete: () => void;
}

export const ProductSidebar = ({
  product,
  actionLoading,
  onDelete,
}: ProductSidebarProps) => {
  const firstVariant = product.variants?.[0];

  return (
    <div className="w-100 space-y-6 sticky top-24 self-start animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white rounded-[2.5rem] shadow-custom p-6 border border-gray-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-600">
            <Store size={20} strokeWidth={2} />
          </div>
          <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">Tổ chức & Cửa hàng</h2>
        </div>

        <div className="space-y-5">
          <div className="group">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">
              Danh mục
            </label>
            <div className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-2xl group-hover:bg-white group-hover:border-gray-200 transition-all duration-300">
              <Tag size={16} className="text-orange-500" />
              <span className="text-sm font-semibold text-gray-700">
                {product.category?.name || "Chưa phân loại"}
              </span>
            </div>
          </div>

          <div className="group">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">
              Cửa hàng sở hữu
            </label>
            <div className="flex items-center gap-4 p-3.5 bg-orange-50/30 border border-gray-100/50 rounded-2xl group-hover:bg-white group-hover:border-gray-200 transition-all duration-300">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm text-orange-500 shrink-0">
                <Building2 size={22} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-800 truncate leading-tight">
                  {(product as any).shop?.shopName || "Hệ thống Calatha"}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">
                     {(product as any).shop?.status || "Đang hoạt động"}
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Card: Giá niêm yết */}
      <div className="bg-white rounded-[2.5rem] shadow-custom p-6 border border-gray-50 overflow-hidden relative group">
        {/* Trang trí góc card */}
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-orange-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-600">
            <Banknote size={20} strokeWidth={2} />
          </div>
          <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">Giá bán niêm yết</h2>
        </div>

        <div className="relative z-10">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2">Giá cơ bản</div>
          <div className="flex items-baseline justify-end gap-1.5">
            <span className="text-3xl font-bold text-orange-600 tabular-nums">
              {product.basePrice?.toLocaleString("vi-VN")}
            </span>
            <span className="text-lg font-bold text-orange-500">₫</span>
          </div>
          
          <div className="mt-5 p-3.5 bg-gray-50 rounded-2xl flex items-start gap-3">
             <ShieldCheck size={16} className="text-orange-400 shrink-0 mt-0.5" />
             <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
               Mức giá này sẽ được áp dụng cho các biến thể nếu không có cài đặt giá riêng.
             </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-custom p-6 border border-gray-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gray-50 rounded-2xl text-gray-600">
            <Box size={20} strokeWidth={2} />
          </div>
          <h2 className="text-[15px] font-bold text-gray-800 tracking-tight">Thông số vật lý</h2>
        </div>

        <div className="space-y-2.5">
          {[
            { icon: <Ruler size={16} />, label: "Kích thước", value: firstVariant?.dimensionsString },
            { icon: <Weight size={16} />, label: "Khối lượng", value: firstVariant?.weightString },
            { icon: <Package size={16} />, label: "Thể tích", value: firstVariant?.volumeCm3 ? `${firstVariant.volumeCm3.toLocaleString()} cm³` : null },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-2xl transition-all duration-200 group/item">
              <div className="flex items-center gap-3 text-gray-500 group-hover/item:text-orange-500 transition-colors">
                {item.icon}
                <span className="text-xs font-bold uppercase tracking-wide">{item.label}</span>
              </div>
              <span className="text-[13px] font-semibold text-gray-700">
                {item.value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 px-1">
        <button
          onClick={onDelete}
          disabled={actionLoading}
          className={cn(
            "w-full flex items-center justify-center gap-3 px-6 py-4.5 bg-white border border-red-100 text-red-500 rounded-4xl",
            "hover:bg-red-50 hover:border-red-200 active:scale-[0.98] transition-all duration-300 shadow-sm",
            "text-xs font-bold uppercase tracking-[0.15em] disabled:opacity-50 group"
          )}
        >
          <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
          {actionLoading ? "Đang xử lý dữ liệu..." : "Gỡ bỏ sản phẩm này"}
        </button>
      </div>
    </div>
  );
};

