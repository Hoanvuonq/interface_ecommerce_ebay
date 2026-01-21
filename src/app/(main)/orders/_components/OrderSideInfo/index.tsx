import React from "react";
import _ from "lodash";
import { Receipt, MapPin, MapPinIcon, Phone, Mail, Truck } from "lucide-react";
import { formatPrice } from "@/hooks/useFormatPrice";
import { OrderSideInfoProps } from "./type";

// Helper to extract pricing from new or legacy structure
const extractPricing = (order: any) => {
  if (order.pricing) {
    return {
      subtotal: order.pricing.subtotal || 0,
      shippingFee: order.pricing.shippingFee || 0,
      originalShippingFee: order.pricing.originalShippingFee || 0,
      totalDiscount: order.pricing.totalDiscount || 0,
      shippingDiscount: order.pricing.shippingDiscount || 0,
      shopDiscount: order.pricing.shopDiscount || 0,
      platformDiscount: order.pricing.platformDiscount || 0,
      taxAmount: order.pricing.taxAmount || 0,
      grandTotal: order.pricing.grandTotal || 0,
    };
  }
  return {
    subtotal: order.subtotal || 0,
    shippingFee: order.shippingFee || 0,
    originalShippingFee: order.shippingFee || 0,
    totalDiscount: order.totalDiscount || 0,
    shippingDiscount: 0,
    shopDiscount: 0,
    platformDiscount: 0,
    taxAmount: order.taxAmount || 0,
    grandTotal: order.grandTotal || 0,
  };
};

// Helper to extract shipping address from new or legacy structure
const extractShippingAddress = (order: any) => {
  if (order.shippingAddress) {
    return {
      recipientName: order.shippingAddress.recipientName || "",
      phoneNumber: order.shippingAddress.phoneNumber || "",
      email: order.shippingAddress.email || "",
      addressLine1: order.shippingAddress.addressLine1 || "",
      addressLine2: order.shippingAddress.addressLine2 || "",
      city: order.shippingAddress.city || "",
      province: order.shippingAddress.province || "",
      postalCode: order.shippingAddress.postalCode || "",
      country: order.shippingAddress.country || "",
    };
  }
  return {
    recipientName: order.recipientName || "",
    phoneNumber: order.phoneNumber || "",
    email: order.email || "",
    addressLine1: order.addressLine1 || "",
    addressLine2: order.addressLine2 || "",
    city: order.city || "",
    province: order.province || "",
    postalCode: order.postalCode || "",
    country: order.country || "",
  };
};

export const OrderSideInfo: React.FC<OrderSideInfoProps> = ({
  order,
  shippingFee: shippingFeeProp,
  paymentLabel,
  showPayment,
  refreshKey,
  handleCancelPayment,
  handleRefresh,
}) => {
  const pricing = extractPricing(order);
  const address = extractShippingAddress(order);
  
  // Use prop shippingFee if provided, otherwise use extracted pricing
  const shippingFee = shippingFeeProp ?? pricing.shippingFee;

  const fullAddress =
    _.chain([
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.province,
      address.country,
    ])
      .filter(_.identity)
      .join(", ")
      .value() || "Không có thông tin địa chỉ";

  return (
    <aside className="lg:col-span-4 space-y-2">
      <section className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
        <header className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Receipt className="text-orange-500" size={18} /> Tóm tắt thanh toán
          </h3>
        </header>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between text-sm text-gray-500 font-medium">
            <span>Tạm tính</span>
            <span className="text-gray-900">
              {formatPrice(pricing.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 font-medium">
            <span>Phí vận chuyển</span>
            <span className="text-gray-900">{formatPrice(shippingFee)}</span>
          </div>
          {pricing.totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-orange-600 bg-orange-50/50 px-3 py-2 rounded-xl border border-gray-100">
              <span className="font-bold">Giảm giá</span>
              <span className="font-semibold">
                -{formatPrice(pricing.totalDiscount)}
              </span>
            </div>
          )}
          {pricing.taxAmount > 0 && (
            <div className="flex justify-between text-sm text-gray-500 font-medium">
              <span>Thuế (VAT)</span>
              <span className="text-gray-900">
                {formatPrice(pricing.taxAmount)}
              </span>
            </div>
          )}
          <div className="h-px bg-gray-100 my-2" />
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900 uppercase">
              Tổng cộng
            </span>
            <span className="text-2xl font-semibold text-orange-600 tracking-tight">
              {formatPrice(pricing.grandTotal)}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
        <header className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 uppercase text-xs tracking-widest">
            <MapPin className="text-blue-500" size={18} /> Địa chỉ nhận hàng
          </h3>
        </header>
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="bg-orange-50 rounded-2xl p-3 shrink-0 shadow-sm border border-gray-100">
              <MapPinIcon size={20} className="text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm uppercase tracking-tight mb-1">
                {address.recipientName || "N/A"}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                {fullAddress}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-600">
              <Phone size={14} className="text-gray-600" />{" "}
              {address.phoneNumber || "N/A"}
            </div>
            {address.email && (
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-600 w-fit">
                <Mail size={14} className="text-gray-600" /> {address.email}
              </div>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
};
