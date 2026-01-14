"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FiDollarSign, 
  FiInfo, 
  FiPackage, 
  FiArrowRight, 
  FiAlertCircle,
  FiShoppingBag,
  FiTag
} from "react-icons/fi";
import { 
  ItemFeeEntry, 
  OrderFeeBreakdownResponse, 
  OrderFeeEntry 
} from "@/api/_types/fee-report.types";
import { feeReportApi } from "@/api/fee-report/feeReportApi";
import { DataTable, SectionLoading } from "@/components";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";

interface OrderFeeCardProps {
  orderId: string;
  compact?: boolean;
}

export const OrderFeeCard: React.FC<OrderFeeCardProps> = ({
  orderId,
  compact = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrderFeeBreakdownResponse | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await feeReportApi.getOrderBreakdown(orderId);
        setData(result);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Không thể tải thông tin phí";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orderId]);

  const formatCurrency = (value?: number | null) =>
    value != null ? value.toLocaleString("vi-VN") + " ₫" : "-";

  const formatPercent = (value?: number | null) =>
    value != null ? `${(value * 100).toFixed(2)}%` : "";

  if (loading) return <SectionLoading message="Đang tính phí quyết toán..." />;

  if (error) {
    return (
      <div className="bg-orange-50 border border-gray-100 rounded-3xl p-4 flex items-center gap-3 text-orange-600">
        <FiAlertCircle size={20} />
        <span className="text-sm font-medium">{error}</span>
      </div>
    );
  }

  if (!data) return null;

  const hasFees = (data.orderFees?.length ?? 0) > 0 || (data.itemFees?.length ?? 0) > 0;

  const orderFeeColumns: Column<OrderFeeEntry>[] = [
    {
      header: "Loại phí",
      render: (record) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{record.displayName}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase">{record.feeType}</span>
        </div>
      )
    },
    {
      header: "Bên chịu",
      align: "center",
      render: (record) => (
        <span className={cn(
          "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter",
          record.chargedTo === "SHOP" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
        )}>
          {record.chargedTo === "SHOP" ? "Shop chịu" : "Sàn chịu"}
        </span>
      )
    },
    {
      header: "Số tiền",
      align: "right",
      render: (record) => (
        <span className="font-bold text-red-500">-{formatCurrency(record.amount)}</span>
      )
    }
  ];

  const itemFeeColumns: Column<ItemFeeEntry>[] = [
    {
      header: "Sản phẩm",
      render: (record) => (
        <div className="flex items-center gap-2 max-w-75">
          <div className="p-2 bg-gray-50 rounded-lg shrink-0 text-gray-400">
            <FiShoppingBag />
          </div>
          <span className="truncate font-medium text-gray-700">{record.productName}</span>
        </div>
      )
    },
    {
      header: "Phí hoa hồng",
      align: "right",
      render: (record) => (
        <div className="flex flex-col items-end">
          <span className="font-bold text-red-500">-{formatCurrency(record.amount)}</span>
          {record.percentage && (
            <span className="text-[10px] text-gray-400 font-bold">Tỷ lệ: {formatPercent(record.percentage)}</span>
          )}
        </div>
      )
    }
  ];

  // Render bản Compact (Dùng cho trang Chi tiết đơn hàng)
  if (compact) {
    return (
      <div className="bg-white border border-gray-100 rounded-4xl shadow-custom overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
            <FiDollarSign size={18} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-tight">Quyết toán tài chính</h3>
        </div>

        {!hasFees ? (
          <div className="p-8 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 ring-8 ring-gray-50/50">
              <FiPackage size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-gray-900 font-bold text-xs uppercase">Chưa tính phí</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase leading-relaxed">
                Phí sẽ được cập nhật khi đơn hàng <br /> chuyển sang trạng thái hoàn thành.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Tóm tắt doanh thu */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Giá trị hàng</p>
                <p className="text-sm font-bold text-gray-800">{formatCurrency(data.productTotal)}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Phí vận chuyển</p>
                <p className="text-sm font-bold text-gray-800">{formatCurrency(data.shippingFee)}</p>
              </div>
            </div>

            {/* List phí sàn */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FiTag /> Phí khấu trừ sàn
              </p>
              <div className="space-y-1.5">
                {data.orderFees?.map((fee, idx) => (
                  <div key={`order-${idx}`} className="flex justify-between items-center px-3 py-2 bg-red-50/30 border border-red-100/50 rounded-xl transition-hover hover:bg-red-50">
                    <span className="text-xs font-medium text-gray-600">{fee.displayName}</span>
                    <span className="text-xs font-bold text-red-500">-{formatCurrency(fee.amount)}</span>
                  </div>
                ))}
                {data.itemFees?.map((fee, idx) => (
                  <div key={`item-${idx}`} className="flex justify-between items-center px-3 py-2 bg-red-50/30 border border-red-100/50 rounded-xl transition-hover hover:bg-red-50">
                    <span className="text-xs font-medium text-gray-600 truncate max-w-37.5">Hoa hồng: {fee.productName}</span>
                    <span className="text-xs font-bold text-red-500">-{formatCurrency(fee.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop thực nhận */}
            <div className="bg-green-50 rounded-3xl p-4 border border-green-100 shadow-inner">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest italic">Shop thực nhận</p>
                  <p className="text-[9px] text-green-600/70 font-bold uppercase">(Sau khi trừ phí sàn)</p>
                </div>
                <div className="text-right font-bold text-xl text-green-600 tracking-tighter">
                  {formatCurrency(data.shopNetRevenue)}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                <FiInfo size={12} />
                <span>Sàn thu: {formatCurrency(data.platformRevenue)}</span>
              </div>
              <Link
                href="/shop/finance/fees"
                className="text-blue-500 text-[10px] font-bold uppercase flex items-center gap-1 hover:text-blue-600 transition-all active:scale-95 group"
              >
                Chi tiết báo cáo <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tóm tắt 3 cột */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-custom text-center space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-blue-600 tracking-tighter">{formatCurrency(data.orderTotal)}</p>
        </div>
        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-custom text-center space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Khấu trừ phí</p>
          <p className="text-2xl font-bold text-red-500 tracking-tighter">-{formatCurrency(data.totalFees)}</p>
        </div>
        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-custom text-center space-y-1 ring-2 ring-green-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Shop thực nhận</p>
          <p className="text-2xl font-bold text-green-600 tracking-tighter">{formatCurrency(data.shopNetRevenue)}</p>
        </div>
      </div>

      {/* Bảng phí đơn hàng */}
      {(data.orderFees?.length ?? 0) > 0 && (
        <DataTable
          headerContent={
            <div className="flex items-center gap-2 px-2">
              <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
              <h3 className="font-bold text-sm text-gray-800 uppercase tracking-tight">Phí cố định đơn hàng</h3>
            </div>
          }
          columns={orderFeeColumns}
          data={data.orderFees || []}
          loading={loading}
          totalElements={data.orderFees?.length || 0}
          page={0}
          size={50}
          onPageChange={() => {}}
        />
      )}

      {/* Bảng phí hoa hồng sản phẩm */}
      {(data.itemFees?.length ?? 0) > 0 && (
        <DataTable
          headerContent={
            <div className="flex items-center gap-2 px-2">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
              <h3 className="font-bold text-sm text-gray-800 uppercase tracking-tight">Hoa hồng sản phẩm</h3>
            </div>
          }
          columns={itemFeeColumns}
          data={data.itemFees || []}
          loading={loading}
          totalElements={data.itemFees?.length || 0}
          page={0}
          size={50}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
};
