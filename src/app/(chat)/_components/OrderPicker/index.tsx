"use client";

import React from "react";
import { ShoppingCart, Send, Package, ExternalLink, Hash } from "lucide-react";
import { OrderPickerProps } from "./type";
import { cn } from "@/utils/cn";
import { PickupModal } from "../modals";
import { formatPrice } from "@/hooks/useFormatPrice";
import { resolveMediaUrl } from "@/utils/products/media.helpers";

export const OrderPicker: React.FC<OrderPickerProps> = (props) => {
  const { isVisible, onClose, orders, isLoading, searchText, onSearchChange, onSendDirect, onViewDetails, isSending, getStatusText } = props;

  return (
    <PickupModal
      isOpen={isVisible}
      onClose={onClose}
      title="Đơn hàng của bạn"
      icon={ShoppingCart}
      searchText={searchText}
      onSearchChange={onSearchChange}
      placeholder="Tìm theo mã đơn hàng..."
      isLoading={isLoading}
    >
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Package size={40} className="mb-3 opacity-20" />
          <p className="text-xs font-bold uppercase tracking-widest italic">Không có đơn hàng</p>
        </div>
      ) : (
        <div className="space-y-4 pb-10">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-4xl border border-gray-100 p-5 shadow-sm hover:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 flex items-center gap-1.5">
                  <Hash size={10} className="text-gray-400" />
                  <span className="text-[11px] font-black text-gray-700 tracking-tighter">{order.orderNumber}</span>
                </div>
                <span className={cn(
                    "text-[9px] font-black px-3 py-1 rounded-full uppercase border shadow-xs",
                    ["DELIVERED", "COMPLETED"].includes(order.status) 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                      : "bg-orange-50 text-orange-600 border-orange-100"
                )}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="space-y-2.5 mb-4">
                {order.items?.slice(0, 2).map((item: any, idx: number) => {
                  const itemImg = resolveMediaUrl({
                    basePath: item.imageBasePath,
                    extension: item.imageExtension,
                    url: item.imageUrl 
                  }, "_thumb");

                  return (
                    <div key={idx} className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 relative bg-gray-50 flex items-center justify-center">
                        {itemImg ? (
                          <img 
                            src={itemImg} 
                            className="w-full h-full object-cover" 
                            alt="product" 
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                          />
                        ) : (
                          <Package size={20} className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate italic">{item.productName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">SL: {item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <p className="text-[13px] font-black text-orange-600 leading-none">{formatPrice(order.grandTotal)}</p>
                <div className="flex gap-2">
                  <button onClick={() => onViewDetails(order)} className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-colors">
                    <ExternalLink size={16} />
                  </button>
                  <button
                    onClick={() => onSendDirect(order)}
                    disabled={isSending}
                    className="flex items-center gap-2 px-5 h-9 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:bg-gray-200"
                  >
                    <Send size={12} /> GỬI
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PickupModal>
  );
};