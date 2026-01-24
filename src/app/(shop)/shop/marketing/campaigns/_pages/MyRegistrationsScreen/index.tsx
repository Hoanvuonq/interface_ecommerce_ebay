"use client";

import React from "react";
import { Package, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { CampaignInfoBanner, RegistrationCard } from "../../_components";
import type { CampaignSlotProductResponse } from "../../_types/campaign.type";

interface MyRegistrationsTabProps {
  registrations: CampaignSlotProductResponse[];
  onCancel: (id: string) => void;
  formatPrice: (price: number) => string;
}

export const MyRegistrationsScreen: React.FC<MyRegistrationsTabProps> = ({
  registrations,
  onCancel,
  formatPrice,
}) => {
  if (registrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-[3rem] p-24 border border-slate-100 shadow-sm animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-50/50">
          <Package className="w-12 h-12  text-gray-200" />
        </div>
        <h3 className=" text-gray-900 font-bold text-2xl tracking-tight">
          Kho đăng ký trống
        </h3>
        <p className=" text-gray-400 max-w-sm text-center mt-3 font-medium text-sm leading-relaxed">
          Bạn chưa có sản phẩm nào tham gia chiến dịch. Hãy khám phá các sự kiện
          mới nhất ngay!
        </p>
      </div>
    );
  }

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return {
          bg: "bg-emerald-500",
          lightBg: "bg-emerald-50",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: "Đã duyệt",
        };
      case "PENDING":
        return {
          bg: "bg-amber-500",
          lightBg: "bg-amber-50",
          icon: <Clock className="w-3.5 h-3.5" />,
          label: "Đang chờ",
        };
      case "REJECTED":
        return {
          bg: "bg-rose-500",
          lightBg: "bg-rose-50",
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: "Từ chối",
        };
      default:
        return {
          bg: "bg-slate-400",
          lightBg: "bg-slate-50",
          icon: null,
          label: status || "N/A",
        };
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {registrations.map((reg) => (
          <RegistrationCard
            key={reg.id}
            reg={reg}
            statusStyles={getStatusStyles(reg.status)}
            progress={Math.min(
              ((reg.stockSold || 0) / (reg.stockLimit || 1)) * 100,
              100,
            )}
            formatPrice={formatPrice}
            onCancel={onCancel}
          />
        ))}
      </div>

      <CampaignInfoBanner />
    </div>
  );
};
