"use client";

import React from "react";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Package,
  TrendingUp,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type {
  CampaignResponse,
  CampaignStatisticsResponse,
} from "../../_types/types";
import { SmartKPICard } from "@/app/(shop)/shop/_components"; // Import component dùng chung

interface CampaignStatisticsTabProps {
  selectedCampaign: CampaignResponse | null;
  campaignStats: CampaignStatisticsResponse | null;
  formatPrice: (price: number) => string;
}

export const CampaignStatisticsTab: React.FC<CampaignStatisticsTabProps> = ({
  selectedCampaign,
  campaignStats,
  formatPrice,
}) => {
  // Trạng thái chưa chọn Campaign
  if (!selectedCampaign) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100 flex flex-col items-center justify-center min-h-100"
      >
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-orange-200">
          <Target size={48} strokeWidth={1.5} />
        </div>
        <h3 className="text-gray-900 font-bold uppercase text-sm tracking-[0.2em] mb-2">
          Chưa chọn tiêu điểm
        </h3>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider max-w-xs leading-relaxed">
          Vui lòng chọn một chiến dịch từ danh sách để xem báo cáo dữ liệu chi
          tiết
        </p>
      </motion.div>
    );
  }

  // Cấu hình các thẻ KPI sử dụng SmartKPICard
  const renderStats = () => {
    if (!campaignStats) {
      // Hiển thị 4 thẻ loading skeleton nếu chưa có dữ liệu
      return Array.from({ length: 4 }).map((_, i) => (
        <SmartKPICard
          key={i}
          title="Đang tải..."
          value={0}
          loading
          icon={<div />}
        />
      ));
    }

    return (
      <>
        <SmartKPICard
          title="Tổng khung giờ"
          value={campaignStats.totalSlots}
          icon={<Calendar size={20} />}
          colorTheme="blue"
          suffix={`(${campaignStats.activeSlots} Active)`}
        />
        <SmartKPICard
          title="Yêu cầu đăng ký"
          value={campaignStats.totalRegistrations}
          icon={<CheckCircle2 size={20} />}
          colorTheme="green"
          suffix={`(${campaignStats.approvedRegistrations} Duyệt)`}
        />
        <SmartKPICard
          title="Sản phẩm đã bán"
          value={campaignStats.totalSold}
          icon={<Package size={20} />}
          colorTheme="orange"
          suffix="Items"
        />
        <SmartKPICard
          title="Ước tính doanh thu"
          value={campaignStats.totalRevenue || 0}
          format="currency" // Tự động định dạng tiền tệ
          icon={<TrendingUp size={20} />}
          colorTheme="purple"
        />
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* HEADER SECTION (Giữ nguyên phong cách xịn của bạn) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <BarChart3 size={160} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">
              Báo cáo hiệu năng
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase italic tracking-tighter leading-none">
            {selectedCampaign.name}
          </h2>
          <p className="text-[11px] text-gray-400 font-bold uppercase mt-2 tracking-widest italic leading-none">
            Dữ liệu thống kê thời gian thực từ hệ thống Calatha
          </p>
        </div>

        <div className="flex gap-2 relative z-10">
          <div className="bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">
              Loại hình
            </p>
            <p className="text-xs font-bold text-gray-800 uppercase leading-none">
              {selectedCampaign.campaignType}
            </p>
          </div>
          <div className="bg-orange-500 px-5 py-3 rounded-2xl shadow-lg shadow-orange-100 text-center">
            <p className="text-[9px] font-bold text-orange-100 uppercase mb-1">
              Trạng thái
            </p>
            <p className="text-xs font-bold text-white uppercase italic leading-none">
              {selectedCampaign.status}
            </p>
          </div>
        </div>
      </div>

      {/* STATS GRID - ĐÃ THAY BẰNG SMART KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStats()}
      </div>

      {/* FOOTER NOTE */}
      <div className="bg-gray-900 rounded-[2.5rem] p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-orange-500">
            <TrendingUp size={20} />
          </div>
          <p className="text-xs text-gray-400 font-medium">
            Dữ liệu này được tổng hợp dựa trên các đơn hàng đã{" "}
            <span className="text-white font-bold italic uppercase">
              Thanh toán thành công
            </span>{" "}
            và{" "}
            <span className="text-white font-bold italic uppercase">
              Giao hàng hoàn tất
            </span>
            .
          </p>
        </div>
      </div>
    </motion.div>
  );
};
