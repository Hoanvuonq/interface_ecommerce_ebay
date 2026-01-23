"use client";

import {
  CheckCircle2,
  MapPin,
  PencilLine,
  Phone,
  Trash2,
  Truck,
  Undo2,
  User,
} from "lucide-react";
import { ShopAddress } from "../ShopAddressForm/type";

interface Props {
  item: ShopAddress;
  index: number;
  onEdit: (item: ShopAddress) => void;
  onDelete: (id: string) => void;
}

export const ShopAddressCard = ({ item, index, onEdit, onDelete }: Props) => {
  const isProtected = item.default || item.defaultPickup || item.defaultReturn;

  return (
    <div className="group relative bg-white border border-slate-200 rounded-4xl p-6 hover:border-orange-400 hover:shadow-[0_20px_40px_rgba(255,115,36,0.1)] transition-all duration-500 overflow-hidden">
      {/* Decorative Background Element - Thu nhỏ lại */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-orange-100/50 transition-colors duration-500" />

      {/* Background Index Number - Giảm kích thước */}
      <span className="absolute -bottom-4 -right-2 text-[80px] font-bold text-slate-50 opacity-[0.05] select-none group-hover:text-orange-500 group-hover:opacity-[0.08] transition-all duration-700 italic leading-none">
        {index + 1}
      </span>

      {/* Badges Status - Gọn hơn */}
      <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
        {item.default && (
          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase rounded-full border border-emerald-100 shadow-sm">
            <CheckCircle2 size={10} strokeWidth={3} /> Mặc định
          </span>
        )}
        {item.defaultPickup && (
          <span className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 text-[9px] font-bold uppercase rounded-full border border-orange-100 shadow-sm">
            <Truck size={10} strokeWidth={3} /> Lấy hàng
          </span>
        )}
        {item.defaultReturn && (
          <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-bold uppercase rounded-full border border-amber-100 shadow-sm">
            <Undo2 size={10} strokeWidth={3} /> Trả hàng
          </span>
        )}
      </div>

      {/* Information Content - Giảm gap và size */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all duration-500 shadow-inner shrink-0">
            <User size={18} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none mb-1.5">
              Người phụ trách
            </p>
            <span className="font-bold text-slate-800 text-sm uppercase tracking-tight italic leading-none">
              {item.fullName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500 shadow-inner shrink-0">
            <Phone size={18} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none mb-1.5">
              Đường dây nóng
            </p>
            <span className="text-sm font-bold text-slate-700 tracking-tighter leading-none">
              {item.phone}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all duration-500 shrink-0 shadow-inner">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none mb-1.5">
              Tọa độ vận hành
            </p>
            <span className="text-[12px] font-medium text-slate-500 leading-snug italic block line-clamp-2 pr-2">
              {item.address.detail}, {item.address.wardName},{" "}
              {item.address.provinceName}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Nhỏ gọn hơn */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
        <button
          onClick={() => onEdit(item)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-orange-500 transition-all font-bold text-[10px] uppercase tracking-wider shadow-md active:scale-95"
        >
          <PencilLine size={12} strokeWidth={3} /> Hiệu chỉnh
        </button>
        {!isProtected && (
          <button
            onClick={() => onDelete(item.addressId)}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-[10px] uppercase tracking-wider active:scale-95"
          >
            <Trash2 size={12} strokeWidth={3} /> Loại bỏ
          </button>)}
      </div>
    </div>
  );
};