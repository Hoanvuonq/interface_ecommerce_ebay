/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Ticket,
  Zap,
  AlertCircle,
  Clock,
  CheckCircle2,
  ShoppingBag,
  Truck,
  Package,
  MousePointerClick,
  Info,
  Inbox,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/hooks/format";
import { getShopInstances } from "@/app/(main)/shop/_service/shop.voucher.service";
import { cn } from "@/utils/cn";

interface VoucherInstance {
  id: string;
  templateId: string;
  voucherCode: string;
  voucherName: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxDiscount?: number;
  voucherScope: "SHOP_ORDER" | "SHIPPING" | "PRODUCT";
  totalQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  expiryDate: string;
  createdDate: string;
  status: "ACTIVE" | "EXPIRED" | "EXHAUSTED";
}

interface PurchasedVoucherListProps {
  onCountUpdate?: (count: number) => void;
}

export const PurchasedVoucherList: React.FC<PurchasedVoucherListProps> = ({
  onCountUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [instances, setInstances] = useState<VoucherInstance[]>([]);

  useEffect(() => {
    const fetchInstances = async () => {
      setLoading(true);
      try {
        const res = await getShopInstances({ page: 0, size: 100 });
        const data = res.data?.content || [];
        setInstances(data);
        if (onCountUpdate) onCountUpdate(data.length);
      } catch (err) {
        console.error("Failed to fetch purchased vouchers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstances();
  }, [onCountUpdate]);

  const getStatusInfo = (instance: VoucherInstance) => {
    const now = dayjs();
    const expiry = dayjs(instance.expiryDate);
    const daysLeft = expiry.diff(now, "day");

    if (instance.remainingQuantity === 0) {
      return {
        color: "bg-gray-100 text-gray-500",
        label: "Đã dùng hết",
        icon: <Inbox size={12} />,
      };
    }
    if (expiry.isBefore(now)) {
      return {
        color: "bg-red-100 text-red-600",
        label: "Đã hết hạn",
        icon: <Clock size={12} />,
      };
    }
    if (daysLeft <= 3) {
      return {
        color: "bg-amber-100 text-amber-700",
        label: `Còn ${daysLeft} ngày`,
        icon: <AlertCircle size={12} />,
      };
    }
    return {
      color: "bg-emerald-100 text-emerald-700",
      label: "Đang hoạt động",
      icon: <CheckCircle2 size={12} />,
    };
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case "SHOP_ORDER":
        return {
          icon: <ShoppingBag size={14} />,
          label: "Đơn hàng",
          color: "text-blue-600 bg-blue-50",
        };
      case "SHIPPING":
        return {
          icon: <Truck size={14} />,
          label: "Miễn ship",
          color: "text-emerald-600 bg-emerald-50",
        };
      case "PRODUCT":
        return {
          icon: <Package size={14} />,
          label: "Sản phẩm",
          color: "text-purple-600 bg-purple-50",
        };
      default:
        return {
          icon: <Zap size={14} />,
          label: scope,
          color: "text-gray-600 bg-gray-50",
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Tip Note Section */}
      <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 flex gap-4 items-start shadow-sm">
        <div className="p-2.5 bg-white rounded-2xl text-amber-500 shadow-sm border border-amber-100">
          <Info size={20} strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900 uppercase tracking-widest">
            Lưu ý vận hành
          </h4>
          <p className="text-xs font-bold text-amber-800/70 leading-relaxed uppercase tracking-tight">
            Voucher đã mua sẽ tự động hiển thị và áp dụng cho khách hàng của bạn
            khi họ thỏa mãn điều kiện đơn hàng trong quá trình thanh toán.
          </p>
        </div>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-4xl border border-gray-100 shadow-custom overflow-hidden min-h-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-100 gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
              Đang tải dữ liệu...
            </span>
          </div>
        ) : instances.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 gap-4 p-8 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
              <Ticket size={40} />
            </div>
            <div className="space-y-1">
              <h3 className="text-gray-900 font-bold uppercase tracking-widest text-sm">
                Trống
              </h3>
              <p className="text-xs text-gray-500 font-medium max-w-62.5">
                Bạn chưa mua voucher nào. Hãy sang tab{" "}
                <span className="font-bold text-orange-500 italic">
                  "Voucher Platform"
                </span>{" "}
                để mua thêm nhé!
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-500 uppercase  border-b border-gray-50">
                  <th className="px-6 py-5">Thông tin Voucher</th>
                  <th className="px-6 py-5 text-right">Mức giảm</th>
                  <th className="px-6 py-5">Sử dụng</th>
                  <th className="px-6 py-5">Trạng thái</th>
                  <th className="px-6 py-5">Hiệu lực</th>
                  <th className="px-6 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence mode="popLayout">
                  {instances.map((item, index) => {
                    const status = getStatusInfo(item);
                    const scope = getScopeIcon(item.voucherScope);
                    const usagePercent = Math.round(
                      ((item.totalQuantity - item.remainingQuantity) /
                        item.totalQuantity) *
                        100,
                    );

                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-orange-50/20 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold w-fit rounded-lg tracking-wider font-mono">
                              {item.voucherCode}
                            </span>
                            <div className="text-sm font-bold text-gray-800 line-clamp-1">
                              {item.voucherName}
                            </div>
                            <div
                              className={cn(
                                "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter w-fit",
                                scope.color,
                              )}
                            >
                              {scope.icon}
                              {scope.label}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-lg font-bold text-red-500 tracking-tighter">
                              {item.discountType === "PERCENTAGE"
                                ? `${item.discountValue}%`
                                : formatCurrency(item.discountValue)}
                            </span>
                            {item.maxDiscount && (
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                Tối đa {formatCurrency(item.maxDiscount)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="w-32 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                              <span>Tiến độ</span>
                              <span className="text-gray-900">
                                {usagePercent}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full transition-all duration-1000",
                                  usagePercent === 100
                                    ? "bg-red-400"
                                    : "bg-orange-500",
                                )}
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                            <div className="text-[10px] font-bold text-gray-500 tabular-nums">
                              {item.usedQuantity}/{item.totalQuantity}{" "}
                              <span className="font-medium text-gray-500">
                                lượt
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-tight",
                              status.color,
                            )}
                          >
                            {status.icon}
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-700">
                              {dayjs(item.expiryDate).format("DD/MM/YYYY")}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">
                              Hết hạn vào
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            disabled={
                              item.remainingQuantity === 0 ||
                              dayjs(item.expiryDate).isBefore(dayjs())
                            }
                            className="px-6 py-2.5 bg-gray-900 text-white text-[10px] font-bold uppercase  rounded-2xl hover:bg-orange-500 transition-all active:scale-95 disabled:opacity-20 disabled:hover:bg-gray-900 shadow-lg shadow-gray-200"
                          >
                            Sử dụng
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
