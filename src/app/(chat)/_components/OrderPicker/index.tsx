"use client";

import React from "react";
import _ from "lodash";
import {
  Search,
  ShoppingCart,
  Send,
  X,
  Package,
  ExternalLink,
  Loader2,
} from "lucide-react";

// 1. Định nghĩa cấu trúc Item bên trong Order để fix lỗi 'unknown'
interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  imageBasePath?: string;
  imageExtension?: string;
  variantAttributes?: string;
}

// 2. Định nghĩa cấu trúc Order cơ bản (giúp code gợi ý tốt hơn)
interface Order {
  orderId: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  grandTotal: number;
  totalQuantity?: number;
}

interface OrderPickerProps {
  isVisible: boolean;
  onClose: () => void;
  orders: Order[]; // Sử dụng Interface Order thay vì any[]
  isLoading: boolean;
  searchText: string;
  onSearchChange: (value: string) => void;
  onSendDirect: (order: Order) => void;
  onViewDetails: (order: Order) => void;
  isSending: boolean;
  getStatusText: (status?: string) => string | undefined;
  resolveOrderItemImageUrl: (
    path?: string | null,
    ext?: string | null,
    size?: "_thumb" | "_medium" | "_large" | "_orig"
  ) => string;
}

export const OrderPicker: React.FC<OrderPickerProps> = ({
  isVisible,
  onClose,
  orders,
  isLoading,
  searchText,
  onSearchChange,
  onSendDirect,
  onViewDetails,
  isSending,
  getStatusText,
  resolveOrderItemImageUrl,
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white border-t border-slate-200 shadow-2xl animate-in slide-in-from-bottom duration-300">
      {/* Header & Search */}
      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-orange-50/50 to-red-50/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-tight">
            <ShoppingCart size={16} />
            Chọn đơn hàng để hỗ trợ
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Order List Area */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-slate-50/30">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="text-xs text-slate-400 font-medium">
              Đang tải đơn hàng...
            </span>
          </div>
        ) : _.isEmpty(orders) ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Package size={40} className="opacity-20 mb-2" />
            <p className="text-sm">Không tìm thấy đơn hàng nào</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2">
            {_.map(orders, (order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm hover:shadow-md transition-all"
              >
                {/* Order Meta */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Mã đơn hàng
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      #{order.orderNumber}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-tighter ${
                      order.status === "DELIVERED" ||
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {getStatusText(order.status) ?? "Không xác định"}
                  </span>
                </div>

                {/* Items Preview */}
                <div className="space-y-2 mb-3">
                  {/* ÉP KIỂU item: OrderItem để fix lỗi TS(18046) */}
                  {_.map(
                    _.slice(_.get(order, "items", []), 0, 2),
                    (item: OrderItem, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-center bg-slate-50/50 p-2 rounded-lg"
                      >
                        <img
                          src={
                            resolveOrderItemImageUrl(
                              item.imageBasePath,
                              item.imageExtension,
                              "_thumb"
                            ) || "/avt.jpg"
                          }
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          alt="item"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            x{item.quantity}
                          </p>
                          {item.variantAttributes && (
                            <p className="text-[9px] text-slate-500 truncate">
                              {item.variantAttributes}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-600">
                          {_.get(item, "unitPrice", 0).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    )
                  )}
                  {_.get(order, "items.length", 0) > 2 && (
                    <p className="text-[10px] text-slate-400 text-center font-medium italic">
                      + {order.items.length - 2} sản phẩm khác
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Tổng thanh toán
                    </span>
                    <span className="text-sm font-bold text-orange-600">
                      {_.get(order, "grandTotal", 0).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </button>
                    <button
                      onClick={() => onSendDirect(order)}
                      disabled={isSending}
                      className="flex items-center gap-2 px-4 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-md shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all disabled:bg-slate-300"
                    >
                      {isSending ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Send size={12} fill="currentColor" />
                      )}
                      Gửi tin
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
