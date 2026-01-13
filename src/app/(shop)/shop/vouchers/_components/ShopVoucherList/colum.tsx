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
  MoreVertical,
  Check
} from "lucide-react";

export const getVoucherColumns = (actions: {
  onDetail: (v: VoucherTemplate) => void;
  onEdit: (v: VoucherTemplate) => void;
  onPurchase: (v: VoucherTemplate) => void;
  onDuplicate: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (v: VoucherTemplate) => void;
}) => [
  {
    header: "Voucher",
    className: "min-w-[250px]",
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
    align: "center" as const,
    render: (item: VoucherTemplate) => (
      <span className={cn(
        "px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-tight shadow-sm border",
        item.discountMethod === "FIXED_AMOUNT" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-orange-100"
      )}>
        {item.discountMethod === "FIXED_AMOUNT" ? formatCurrency(item.discountValue) : `${item.discountValue}%`}
      </span>
    ),
  },
  {
    header: "Trạng thái",
    align: "center" as const,
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
    align: "right" as const,
    render: (item: VoucherTemplate) => {
      const isShopVoucher = item.creatorType === "SHOP";
      return (
        <div className="flex items-center justify-end gap-2">
          {/* Nút xem chi tiết luôn hiện */}
          <button 
            onClick={() => actions.onDetail(item)} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900"
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </button>

          {isShopVoucher ? (
            <button 
              onClick={() => actions.onEdit(item)} 
              className="p-2 hover:bg-orange-50 rounded-xl text-gray-400 hover:text-orange-600"
              title="Chỉnh sửa"
            >
              <Edit3 size={18} />
            </button>
          ) : (
            item.purchasable && (
              <button 
                onClick={() => actions.onPurchase(item)} 
                className="p-2 bg-gray-900 text-white rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-gray-200"
                title="Mua Voucher"
              >
                <ShoppingCart size={18} />
              </button>
            )
          )}

          {/* Menu mở rộng - Thay thế Antd Dropdown */}
          {isShopVoucher && (
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 group-hover:text-gray-900 transition-all">
                <MoreVertical size={18} />
              </button>
              
              {/* Dropdown Content - Hiệu ứng giống SelectComponent của bạn */}
              <div className={cn(
                "absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-[50]",
                "invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out"
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

                <div className="h-[1px] bg-gray-50 my-1 mx-2" />

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