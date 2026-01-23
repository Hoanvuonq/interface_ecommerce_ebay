import React from "react";
import { VoucherTemplate } from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/hooks/format";
import { 
  Eye, 
  Edit3, 
  ShoppingCart, 
  Copy, 
  Power, 
  Trash2, 
  MoreVertical 
} from "lucide-react";
import { Column } from "@/components/DataTable/type";
import { ActionBtn } from "@/components";

export const getVoucherColumns = (actions: {
  onDetail: (v: VoucherTemplate) => void;
  onEdit: (v: VoucherTemplate) => void;
  onPurchase: (v: VoucherTemplate) => void;
  onDuplicate: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (v: VoucherTemplate) => void;
}): Column<VoucherTemplate>[] => [
  {
    header: "Voucher",
    className: "min-w-62.5",
    render: (item: VoucherTemplate) => (
      <div className="flex flex-col gap-1">
        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold w-fit rounded-lg tracking-widest font-mono border border-blue-100 uppercase">
          {item.code}
        </span>
        <span className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</span>
      </div>
    ),
  },
  {
    header: "Ưu đãi",
    align: "center",
    render: (item: VoucherTemplate) => (
      <span className={cn(
        "px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-tight shadow-sm border",
        item.discountMethod === "FIXED_AMOUNT" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-gray-100"
      )}>
        {item.discountMethod === "FIXED_AMOUNT" ? formatCurrency(item.discountValue) : `${item.discountValue}%`}
      </span>
    ),
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (item: VoucherTemplate) => (
      <div className="flex items-center justify-center gap-2">
         <div className={cn("w-2 h-2 rounded-full", item.active ? "bg-emerald-500 animate-pulse" : "bg-gray-300")} />
         <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
           {item.active ? "Online" : "Offline"}
         </span>
      </div>
    ),
  },
  {
    header: "Hành động",
    align: "right",
    render: (item: VoucherTemplate) => {
      const isShopVoucher = item.creatorType === "SHOP";
      
      return (
        <div className="flex items-center justify-end gap-2">
          <ActionBtn 
            onClick={() => actions.onDetail(item)}
            icon={<Eye size={18} />}
            tooltip="Xem chi tiết"
          />

          {isShopVoucher ? (
            <ActionBtn 
              onClick={() => actions.onEdit(item)}
              icon={<Edit3 size={18} />}
              color="text-orange-600 hover:bg-orange-50 border-orange-100"
              tooltip="Chỉnh sửa"
            />
          ) : (
            item.purchasable && (
              <ActionBtn 
                onClick={() => actions.onPurchase(item)}
                icon={<ShoppingCart size={18} />}
                color="bg-gray-900 text-white hover:bg-orange-500 shadow-lg"
                tooltip="Mua Voucher"
              />
            )
          )}

          {/* Menu mở rộng */}
          {isShopVoucher && (
            <div className="relative group">
              <ActionBtn 
                icon={<MoreVertical size={18} />}
              />
              
              {/* Dropdown Content */}
              <div className={cn(
                "absolute right-0 top-[110%] w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2",
                "z-9999 transition-all duration-200 ease-out", // Tăng Z-index cực cao
                "invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
              )}>
                <button 
                  onClick={() => actions.onDuplicate(item.id)}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <Copy size={14} className="text-blue-500" /> Sao chép
                </button>
                
                <button 
                  onClick={() => actions.onToggle(item.id)}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <Power size={14} className={item.active ? "text-rose-500" : "text-emerald-500"} /> 
                  {item.active ? "Tắt voucher" : "Bật voucher"}
                </button>

                <div className="h-px bg-gray-50 my-1 mx-2" />

                <button 
                  onClick={() => actions.onDelete(item)}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <Trash2 size={14} /> Xóa vĩnh viễn
                </button>
              </div>
            </div>
          )}
        </div>
      );
    },
  },
];