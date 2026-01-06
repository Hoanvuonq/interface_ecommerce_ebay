  /* eslint-disable @next/next/no-img-element */
  "use client";

  import React, { useMemo } from "react";
  import _ from "lodash";
  import { ShieldCheck, ShoppingBag, ArrowRight, Package, Truck, Wallet } from "lucide-react";
  import { formatPrice } from "@/hooks/useFormatPrice";
  import { ORDER_STATUS_UI, PAYMENT_METHOD_LABELS } from "../../_constants/order";
  import { OrderCardProps, resolveOrderItemImageUrl } from "../../_types/order";
  import { useOrderActions } from "../../_hooks/useOrderActions";
  import { cn } from "@/utils/cn";
  import Image from "next/image";

  export const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetail, onOrderCancelled }) => {
    const { state } = useOrderActions(order.orderId, order.status, onOrderCancelled);
    
   const ui = useMemo(() => {
    const config = ORDER_STATUS_UI[order.status] || ORDER_STATUS_UI.CREATED;
    const shopName = _.get(order, "shopInfo.shopName", "Cửa hàng");
    const shopLogo = _.get(order, "shopInfo.logoUrl");

    return {
      config,
      shopName: _.truncate(shopName, { length: 25 }),
      shopLogo, 
      itemCount: order.items.length,
      firstItem: _.first(order.items),
      paymentLabel: PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod
    };
  }, [order]);

    return (
      <article className="group relative bg-white border border-slate-100 rounded-4xl p-4 sm:p-5 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 mb-3 overflow-hidden">
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 group-hover:w-1.5" 
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
           <div className="relative w-10 h-10 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
            {ui.shopLogo ? (
              <Image 
                src={ui.shopLogo} 
                alt={ui.shopName} 
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package size={18} className="text-slate-300" />
            )}
          </div>
            <div className="min-w-0">
              <h4 className="text-[13px] sm:text-[14px] font-bold text-slate-800 leading-none uppercase truncate">
                {ui.shopName}
              </h4>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 block uppercase">
                MÃ ĐƠN: #{order.orderNumber}
              </span>
            </div>
          </div>

          <div className={cn(
            "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border shadow-sm",
            ui.config.bg, ui.config.text, ui.config.border
          )}>
            {ui.config.icon}
            <span>{ui.config.label}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pl-2">
          <div className="flex -space-x-4 overflow-hidden shrink-0 p-2">
            {_.take(order.items, 3).map((item, i) => {
              const imgUrl = resolveOrderItemImageUrl(item.imageBasePath, item.imageExtension, "_thumb");
              return (
                <div key={i} className="relative w-16 h-16 cursor-pointer rounded-2xl border-2 border-white bg-slate-50 overflow-hidden duration-300 shadow-custom transition-transform group-hover:translate-x-1">
                  {imgUrl ? (
                    <Image src={imgUrl} alt="sản phẩm" fill className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                      <Package size={20} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              );
            })}
            {ui.itemCount > 3 && (
              <div className="w-14 h-14 rounded-2xl border-2 border-white bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white shadow-md z-10">
                +{ui.itemCount - 3}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 w-full">
            <p className="text-[13px] font-bold text-slate-700 truncate mb-2">
              {ui.firstItem?.productName}
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                <Truck size={12} strokeWidth={2} />
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  Giao: {order.shippingFee > 0 ? formatPrice(order.shippingFee) : "Miễn phí"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                <Wallet size={12} strokeWidth={2} />
                <span className="text-[10px] font-bold uppercase italic">
                  {ui.paymentLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
            <div className="flex flex-col items-start sm:items-end">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-(--color-mainColor) tracking-tighter">
                  {formatPrice(order.grandTotal)}
                </span>
            </div>

            <button 
              onClick={() => onViewDetail(order.orderId)}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl text-white flex items-center justify-center bg-(--color-mainColor) hover:scale-105 duration-300 transition-all active:scale-90 shadow-xl"
            >
              <ArrowRight size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {order.status === "DELIVERED" && (
          <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 pointer-events-none rounded-tr-4xl">
            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-3 pt-4 pl-4 rounded-bl-full shadow-lg border-b border-l border-white/20">
              <ShieldCheck size={16} strokeWidth={3} className="rotate-12" />
            </div>
          </div>
        )}
      </article>
    );
  };