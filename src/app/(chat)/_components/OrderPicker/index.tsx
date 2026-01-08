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
  Calendar,
  Hash,
} from "lucide-react";
import { OrderItem, OrderPickerProps } from "./type";
import { cn } from "@/utils/cn"; 

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
    <div className="bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
      <div className="px-4 py-4 border-b border-orange-100 bg-gradient-to-r from-orange-50/80 to-white backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                Đơn hàng của bạn
              </h3>
              <p className="text-[10px] text-gray-500 font-medium italic">
                Chọn một đơn hàng để gửi hỗ trợ nhanh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-100 rounded-full text-gray-400 hover:text-orange-600 transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative group">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
          />
          <input
            placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-100/50 border border-transparent rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Order List Area */}
      <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-white">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <ShoppingCart
                size={16}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500"
              />
            </div>
            <span className="text-xs text-gray-500 font-semibold animate-pulse">
              Đang đồng bộ đơn hàng...
            </span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="p-5 bg-gray-50 rounded-full mb-4">
              <Package size={48} className="opacity-20" />
            </div>
            <p className="text-sm font-bold text-gray-500">Không có dữ liệu</p>
            <p className="text-xs">Thử tìm kiếm với từ khóa khác nhé!</p>
          </div>
        ) : (
          <div className="flex flex-col p-3 gap-3">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="group bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:border-orange-200 hover:shadow-orange-100/50 hover:shadow-xl transition-all duration-300"
              >
                {/* Order Meta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                      <Hash size={12} className="opacity-60" />
                      <span className="text-xs font-black tracking-tighter">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400">
                      <Calendar size={12} />
                      {/* Giả định bạn có trường createdAt */}
                      <span>Vừa xong</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider",
                      order.status === "DELIVERED" ||
                        order.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : order.status === "CANCELLED"
                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    )}
                  >
                    {getStatusText(order.status) ?? "N/A"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items
                    ?.slice(0, 2)
                    .map((item: OrderItem, idx: number) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-center bg-gray-50/40 p-2 rounded-xl group-hover:bg-white group-hover:border-gray-100 border border-transparent transition-colors"
                      >
                        <div className="relative overflow-hidden rounded-lg border border-gray-100">
                          <img
                            src={
                              resolveOrderItemImageUrl(
                                item.imageBasePath,
                                item.imageExtension,
                                "_thumb"
                              ) || "/avt.jpg"
                            }
                            className="w-11 h-11 object-cover transition-transform duration-500 group-hover:scale-110"
                            alt="product"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-500 font-bold bg-white px-1.5 rounded border border-gray-100">
                              x{item.quantity}
                            </span>
                            {item.variantAttributes && (
                              <span className="text-[9px] text-gray-400 truncate italic">
                                {item.variantAttributes}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-gray-700">
                            {item.unitPrice?.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                    ))}

                  {order.items.length > 2 && (
                    <div className="flex items-center justify-center py-1">
                      <div className="h-[1px] flex-1 bg-gray-100"></div>
                      <span className="px-3 text-[10px] text-gray-400 font-bold italic">
                        +{order.items.length - 2} sản phẩm khác
                      </span>
                      <div className="h-[1px] flex-1 bg-gray-100"></div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-0.5">
                      Tổng thanh toán
                    </p>
                    <p className="text-base font-black text-orange-600 leading-none">
                      {order.grandTotal?.toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="flex items-center justify-center w-9 h-9 bg-gray-50 text-gray-500 rounded-xl hover:bg-orange-50 hover:text-orange-600 border border-gray-100 transition-all duration-200"
                      title="Xem chi tiết đơn hàng"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button
                      onClick={() => onSendDirect(order)}
                      disabled={isSending}
                      className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:translate-y-0"
                    >
                      {isSending ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      )}
                      GỬI HỖ TRỢ
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
