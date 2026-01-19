"use client";

import type { ShopFeeSummaryResponse } from "@/api/_types/fee-report.types";
import { feeReportApi } from "@/api/fee-report/feeReportApi";
import { getCurrentUserShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  DollarSign,
  FileText,
  Inbox,
  Loader2,
  Store,
  TrendingDown,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { OrderFeeBreakdownViewer } from "../_components/OrderFeeBreakdownViewer";

export const ShopFeeReportScreen: React.FC = () => {
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string | null>(null);
  const [loadingShop, setLoadingShop] = useState(true);

  const [dateRange, setDateRange] = useState({
    from: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  });

  const [data, setData] = useState<ShopFeeSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current shop info
  useEffect(() => {
    const fetchShop = async () => {
      setLoadingShop(true);
      try {
        const res = await getCurrentUserShopDetail();
        if (res?.success && res.data) {
          setShopId(res.data.shopId);
          setShopName(res.data.shopName);
        } else {
          setError("Không thể lấy thông tin shop");
        }
      } catch (e: any) {
        setError(e.message || "Không thể lấy thông tin shop");
      } finally {
        setLoadingShop(false);
      }
    };
    fetchShop();
  }, []);

  // Fetch fee data
  useEffect(() => {
    if (!shopId) return;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await feeReportApi.getShopSummary(
          shopId,
          dateRange.from,
          dateRange.to
        );
        setData(result);
      } catch (e: any) {
        setError(e.message || "Không thể tải báo cáo phí");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [shopId, dateRange.from, dateRange.to]);

  const formatCurrency = (value?: number | null) =>
    value != null ? value.toLocaleString("vi-VN") + " ₫" : "-";

  const feeBreakdown = useMemo(() => {
    if (!data || !data.feeBreakdown?.length) return [];
    const total = data.totalFees || 1;
    return data.feeBreakdown.map((fee) => ({
      ...fee,
      percentage: (fee.totalAmount / total) * 100,
    }));
  }, [data]);

  if (loadingShop)
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
          Đang tải thông tin shop...
        </span>
      </div>
    );

  if (!shopId)
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">
            Bạn chưa có shop hoặc chưa đăng nhập với tài khoản shop.
          </p>
        </div>
      </div>
    );

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3 uppercase tracking-tight">
            <FileText className="text-orange-500" />
            Báo cáo phí
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Shop: <span className="text-gray-900 font-bold">{shopName}</span> •
            Theo dõi chi phí và doanh thu thực nhận
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 px-3">
            <Calendar size={16} className="text-gray-500" />
            <input
              type="date"
              className="text-sm font-bold text-gray-700 outline-none bg-transparent"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
            />
            <span className="text-gray-500">→</span>
            <input
              type="date"
              className="text-sm font-bold text-gray-700 outline-none bg-transparent"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between text-red-700 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3 font-medium">
            <AlertCircle size={20} />
            {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        data && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard
                title="Tổng GMV"
                value={data.totalGmv}
                subValue={`${data.totalOrders} đơn hàng`}
                icon={<Store className="text-blue-600" />}
                color="blue"
              />
              <SummaryCard
                title="Phí bị trừ"
                value={data.totalFees}
                subValue="Phí sàn & dịch vụ"
                icon={<TrendingDown className="text-red-600" />}
                color="red"
                isNegative
              />
              <SummaryCard
                title="Thực nhận"
                value={data.netRevenue}
                subValue="GMV - Tổng phí"
                icon={<DollarSign className="text-emerald-600" />}
                color="emerald"
              />
            </div>

            {/* Fee Breakdown Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-custom overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800 tracking-tight">
                  Chi tiết từng loại phí
                </h3>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">
                  Phân tích tỉ trọng
                </span>
              </div>

              <div className="overflow-x-auto">
                {feeBreakdown.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em]">
                        <th className="px-8 py-5">Loại phí</th>
                        <th className="px-8 py-5 text-right">Tổng số tiền</th>
                        <th className="px-8 py-5 text-center">Số lần</th>
                        <th className="px-8 py-5 text-right">Trung bình</th>
                        <th className="px-8 py-5">Tỉ lệ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {feeBreakdown.map((fee) => (
                        <tr
                          key={fee.feeType}
                          className="group hover:bg-orange-50/30 transition-colors"
                        >
                          <td className="px-8 py-5">
                            <div className="font-bold text-gray-700">
                              {fee.displayName}
                            </div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase">
                              {fee.feeType}
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right font-bold text-red-500">
                            -{formatCurrency(fee.totalAmount)}
                          </td>
                          <td className="px-8 py-5 text-center font-bold text-gray-500">
                            {fee.count}
                          </td>
                          <td className="px-8 py-5 text-right font-medium text-gray-600 italic">
                            {formatCurrency(fee.averageAmount)}
                          </td>
                          <td className="px-8 py-5 w-48">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-red-400 rounded-full"
                                  style={{ width: `${fee.percentage}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-gray-500 w-10">
                                {fee.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-900 text-white font-bold">
                        <td className="px-8 py-5 rounded-bl-3xl">Tổng cộng</td>
                        <td className="px-8 py-5 text-right text-orange-400 font-bold">
                          -{formatCurrency(data.totalFees)}
                        </td>
                        <td className="px-8 py-5 text-center">
                          {feeBreakdown.reduce((sum, f) => sum + f.count, 0)}
                        </td>
                        <td className="px-8 py-5"></td>
                        <td className="px-8 py-5 rounded-br-3xl">
                          <div className="w-full h-1 bg-white/20 rounded-full" />
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Inbox size={48} className="text-gray-200" />
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                      Không có dữ liệu
                    </p>
                  </div>
                )}
              </div>
            </div>

            <OrderFeeBreakdownViewer />
          </div>
        )
      )}
    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  subValue,
  icon,
  color,
  isNegative,
}: any) => {
  const colors: any = {
    blue: "from-blue-50 to-white border-blue-100 text-blue-700",
    red: "from-red-50 to-white border-red-100 text-red-700",
    emerald: "from-emerald-50 to-white border-emerald-100 text-emerald-700",
  };

  return (
    <div
      className={cn(
        "relative p-6 rounded-4xl border bg-linear-to-br shadow-sm group hover:shadow-md transition-all duration-300",
        colors[color]
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <ArrowUpRight
          className="text-gray-500 group-hover:text-gray-500 transition-colors"
          size={20}
        />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
          {isNegative && "-"}
          {value?.toLocaleString("vi-VN")} ₫
        </h3>
        <p className="mt-2 text-xs font-bold text-gray-500 flex items-center gap-1.5 uppercase tracking-tighter">
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
          {subValue}
        </p>
      </div>
    </div>
  );
};
