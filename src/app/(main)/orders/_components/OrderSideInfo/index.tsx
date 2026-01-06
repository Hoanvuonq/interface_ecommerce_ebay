import React from "react";
import _ from "lodash";
import { Receipt, MapPin, MapPinIcon, Phone, Mail, Truck } from "lucide-react";
import { formatPrice } from "@/hooks/useFormatPrice";
import { OrderSideInfoProps } from "./type";

export const OrderSideInfo: React.FC<OrderSideInfoProps> = ({
  order,
  shippingFee,
  paymentLabel,
  showPayment,
  refreshKey,
  handleCancelPayment,
  handleRefresh,
}) => {
  const fullAddress =
    _.chain([
      order.addressLine1,
      order.addressLine2,
      order.city,
      order.province,
      order.country,
    ])
      .filter(_.identity)
      .join(", ")
      .value() || "Không có thông tin địa chỉ";

  return (
    <aside className="lg:col-span-4 space-y-2">
      <section className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
        <header className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Receipt className="text-orange-500" size={18} /> Tóm tắt thanh toán
          </h3>
        </header>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between text-sm text-slate-500 font-medium">
            <span>Tạm tính</span>
            <span className="text-slate-900">
              {formatPrice(order.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-slate-500 font-medium">
            <span>Phí vận chuyển</span>
            <span className="text-slate-900">{formatPrice(shippingFee)}</span>
          </div>
          {order.totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-orange-600 bg-orange-50/50 px-3 py-2 rounded-xl border border-orange-100">
              <span className="font-bold">Giảm giá</span>
              <span className="font-semibold">
                -{formatPrice(order.totalDiscount)}
              </span>
            </div>
          )}
          {order.taxAmount > 0 && (
            <div className="flex justify-between text-sm text-slate-500 font-medium">
              <span>Thuế (VAT)</span>
              <span className="text-slate-900">
                {formatPrice(order.taxAmount)}
              </span>
            </div>
          )}
          <div className="h-px bg-slate-100 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-slate-900 uppercase">
              Tổng cộng
            </span>
            <span className="text-2xl font-semibold text-orange-600 tracking-tight">
              {formatPrice(order.grandTotal)}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
        <header className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2 uppercase text-xs tracking-widest">
            <MapPin className="text-blue-500" size={18} /> Địa chỉ nhận hàng
          </h3>
        </header>
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="bg-orange-50 rounded-2xl p-3 shrink-0 shadow-sm border border-orange-100">
              <MapPinIcon size={20} className="text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm uppercase tracking-tight mb-1">
                {order.recipientName || "N/A"}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {fullAddress}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-xs font-bold text-slate-600">
              <Phone size={14} className="text-slate-400" />{" "}
              {order.phoneNumber || "N/A"}
            </div>
            {order.email && (
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 w-fit">
                <Mail size={14} className="text-slate-400" /> {order.email}
              </div>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
};
