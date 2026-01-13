/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  Search,
  Calendar,
  RefreshCcw,
  Eraser,
  Trophy,
  TrendingUp,
  DollarSign,
  Gift,
  Loader2,
  Inbox,
  Target,
} from "lucide-react";
import dayjs from "dayjs";
import {
  useSearchVoucherTemplates,
  useGetAllVoucherStats,
} from "../../_hooks/useShopVoucher";
import { DataTable } from "@/components";
import { cn } from "@/utils/cn";

interface VoucherStats {
  voucherCode: string;
  voucherName: string;
  templateId: string;
  totalUsed?: number;
  usedCount?: number;
  totalDiscount?: number;
  orderCount?: number;
  usageRate?: number;
  remainingCount?: number;
  totalQuantity?: number;
}

const VoucherStatistics: React.FC = () => {
  const [period, setPeriod] = useState<string>("30days");
  const [searchText, setSearchText] = useState("");
  const [voucherData, setVoucherData] = useState<any>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { searchTemplates, loading: loadingVouchers } =
    useSearchVoucherTemplates();
  const {
    allStats,
    fetchAllStats,
    loading: loadingStats,
  } = useGetAllVoucherStats();

  const fetchVouchers = async () => {
    const result = await searchTemplates({
      scope: "shop",
      page: 0,
      size: 100,
      q: searchText || undefined,
    });
    if (result?.code === 1000 && result.data) {
      setVoucherData(result.data);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  useEffect(() => {
    if (voucherData?.content?.length > 0) {
      fetchAllStats(voucherData.content);
    }
  }, [voucherData]);

  const loading = loadingVouchers || loadingStats;

  // Overview Totals
  const totals = useMemo(
    () => ({
      used: allStats.reduce(
        (sum, s) => sum + (s.usedCount || s.totalUsed || 0),
        0
      ),
      discount: allStats.reduce((sum, s) => sum + (s.totalDiscount || 0), 0),
      orders: allStats.reduce((sum, s) => sum + (s.orderCount || 0), 0),
    }),
    [allStats]
  );

  const tableStats: VoucherStats[] = useMemo(
    () =>
      allStats
        .map((stat) => ({
          ...stat,
          totalUsed: stat.usedCount || stat.totalUsed || 0,
          usageRate: stat.totalQuantity
            ? Math.round(((stat.usedCount || 0) / stat.totalQuantity) * 100)
            : 0,
        }))
        .filter(
          (s) =>
            s.voucherCode.toLowerCase().includes(searchText.toLowerCase()) ||
            s.voucherName.toLowerCase().includes(searchText.toLowerCase())
        ),
    [allStats, searchText]
  );

  const columns = [
    {
      header: "Voucher",
      render: (item: VoucherStats) => (
        <div className="flex flex-col gap-1">
          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold w-fit rounded uppercase tracking-wider font-mono">
            {item.voucherCode}
          </span>
          <span className="text-sm font-bold text-gray-800 line-clamp-1">
            {item.voucherName}
          </span>
        </div>
      ),
    },
    {
      header: "Lượt dùng",
      align: "center" as const,
      render: (item: VoucherStats) => (
        <span className="font-bold text-gray-900 text-base">
          {item.totalUsed?.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Hiệu suất sử dụng",
      className: "min-w-[150px]",
      render: (item: VoucherStats) => {
        const rate = item.usageRate || 0;
        return (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-gray-400">Tỷ lệ</span>
              <span
                className={cn(
                  rate > 70 ? "text-emerald-500" : "text-orange-500"
                )}
              >
                {rate}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-1000",
                  rate > 70 ? "bg-emerald-500" : "bg-orange-500"
                )}
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Đơn hàng",
      align: "center" as const,
      render: (item: VoucherStats) => (
        <span className="text-sm font-bold text-blue-600">
          {item.orderCount?.toLocaleString()} đơn
        </span>
      ),
    },
    {
      header: "Tổng giảm giá",
      align: "right" as const,
      render: (item: VoucherStats) => (
        <span className="text-sm font-bold text-rose-500 tabular-nums">
          {item.totalDiscount?.toLocaleString()}₫
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-900 rounded-2xl text-white shadow-lg">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
              Thống kê Voucher
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Phân tích hiệu quả kinh doanh
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm mã/tên voucher..."
              className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 w-64 outline-none transition-all"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-gray-50 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest outline-none border-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="7days">7 Ngày qua</option>
            <option value="30days">30 Ngày qua</option>
            <option value="90days">90 Ngày qua</option>
          </select>
          <button
            onClick={fetchVouchers}
            className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all shadow-sm"
          >
            <RefreshCcw size={18} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard
          label="Tổng lượt dùng"
          value={totals.used}
          icon={<TrendingUp size={20} />}
          color="emerald"
        />
        <OverviewCard
          label="Tổng giảm giá"
          value={totals.discount}
          icon={<DollarSign size={20} />}
          color="rose"
          isCurrency
        />
        <OverviewCard
          label="Đơn hàng phát sinh"
          value={totals.orders}
          icon={<Target size={20} />}
          color="blue"
        />
      </div>

      {/* Main Table Container */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <BarChart3 size={14} /> Bảng xếp hạng chi tiết
        </div>
        <DataTable
          data={tableStats}
          columns={columns}
          loading={loading}
          page={0}
          size={pagination.pageSize}
          totalElements={tableStats.length}
          onPageChange={() => {}}
        />
      </div>

      {/* Leaderboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopBox
          title="Voucher Hiệu Quả Nhất"
          icon={<Trophy className="text-amber-500" />}
          data={tableStats
            .sort((a, b) => (b.usageRate || 0) - (a.usageRate || 0))
            .slice(0, 5)}
          type="rate"
        />
        <TopBox
          title="Ngân Sách Giảm Lớn Nhất"
          icon={<TrendingUp className="text-rose-500" />}
          data={tableStats
            .sort((a, b) => (b.totalDiscount || 0) - (a.totalDiscount || 0))
            .slice(0, 5)}
          type="discount"
        />
      </div>
    </div>
  );
};

const OverviewCard = ({ label, value, icon, color, isCurrency }: any) => (
  <div
    className={cn(
      "p-6 rounded-[2.5rem] border bg-gradient-to-br shadow-sm transition-all hover:shadow-md",
      color === "emerald"
        ? "from-emerald-50 to-white border-emerald-100"
        : color === "rose"
        ? "from-rose-50 to-white border-rose-100"
        : "from-blue-50 to-white border-blue-100"
    )}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white rounded-2xl shadow-sm border border-white/50 text-gray-600">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 opacity-50">
        Realtime
      </span>
    </div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
      {isCurrency ? value?.toLocaleString() + "₫" : value?.toLocaleString()}
    </h3>
  </div>
);

const TopBox = ({ title, icon, data, type }: any) => (
  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-custom overflow-hidden">
    <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
      {icon}
      <h3 className="font-bold text-gray-800 tracking-tight uppercase text-sm">
        {title}
      </h3>
    </div>
    <div className="p-4 space-y-3">
      {data.length > 0 ? (
        data.map((item: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs",
                  idx === 0
                    ? "bg-amber-100 text-amber-600"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                #{idx + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-gray-800 font-mono tracking-wider">
                  {item.voucherCode}
                </p>
                <p className="text-[10px] text-gray-400 font-medium uppercase">
                  {item.voucherName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                {type === "rate"
                  ? `${item.usageRate}%`
                  : `${item.totalDiscount?.toLocaleString()}₫`}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                {item.totalUsed} lượt dùng
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="py-10 text-center text-gray-400 italic text-sm font-medium">
          Chưa có dữ liệu xếp hạng
        </div>
      )}
    </div>
  </div>
);

export default VoucherStatistics;
