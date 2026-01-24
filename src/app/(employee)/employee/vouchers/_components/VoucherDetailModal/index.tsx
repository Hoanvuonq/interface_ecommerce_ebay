"use client";

import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import {
  Calendar,
  FileText,
  Info,
  Layers,
  ShieldCheck,
  Store,
  User,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { InstanceList } from "../InstanceList";
import { VoucherDetailModalProps } from "./type";

export const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({
  open,
  onClose,
  template,
  voucherInfo,
  isLoading,
  onUseInstance,
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "instances">("info");

  if (!template) return null;

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      width="max-w-5xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-200">
            <FileText size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold uppercase tracking-tight  text-gray-800">
            Protocol Explorer:{" "}
            <span className="text-orange-500">#{template.code}</span>
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-6 py-2">
        <div className="flex p-1.5 bg-slate-100/80 rounded-2xl w-fit self-center md:self-start">
          <button
            onClick={() => setActiveTab("info")}
            className={cn(
              "px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all",
              activeTab === "info"
                ? "bg-white text-orange-600 shadow-sm"
                : " text-gray-400 hover:text-gray-600",
            )}
          >
            Thông tin Protocol
          </button>
          <button
            onClick={() => setActiveTab("instances")}
            className={cn(
              "px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2",
              activeTab === "instances"
                ? "bg-white text-orange-600 shadow-sm"
                : " text-gray-400 hover:text-gray-600",
            )}
          >
            Thực thể Instances
            <span className="px-1.5 py-0.5 rounded-md bg-slate-200  text-gray-500 text-[9px]">
              {voucherInfo?.instances.length || 0}
            </span>
          </button>
        </div>

        {activeTab === "info" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-6">
              <DetailSection title="Thông tin cơ bản" icon={<Info size={16} />}>
                <DataRow label="Tên Voucher" value={template.name} bold />
                <DataRow
                  label="Mô tả"
                  value={template.description || "N/A"}
                  italic
                />
                <DataRow
                  label="Phân loại"
                  value={
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase border",
                        template.creatorType === "PLATFORM"
                          ? "bg-blue-50 border-blue-100 text-blue-600"
                          : "bg-emerald-50 border-emerald-100 text-emerald-600",
                      )}
                    >
                      {template.creatorType === "PLATFORM"
                        ? "🎁 Platform Sponsor"
                        : "🏪 Shop Own"}
                    </span>
                  }
                />
              </DetailSection>

              <DetailSection title="Cấu hình ưu đãi" icon={<Zap size={16} />}>
                <DataRow
                  label="Loại ưu đãi"
                  value={
                    template.discountType === "PERCENTAGE"
                      ? "Phần trăm (%)"
                      : "Số tiền cố định (₫)"
                  }
                />
                <DataRow
                  label="Giá trị giảm"
                  value={
                    <span className="text-lg font-bold text-emerald-600">
                      {template.discountType === "PERCENTAGE"
                        ? `${template.discountValue}%`
                        : `${template.discountValue.toLocaleString()}₫`}
                    </span>
                  }
                />
                <DataRow
                  label="Đơn tối thiểu"
                  value={
                    template.minOrderAmount
                      ? `${template.minOrderAmount.toLocaleString()}₫`
                      : "Không giới hạn"
                  }
                />
                <DataRow
                  label="Giảm tối đa"
                  value={
                    template.maxDiscount
                      ? `${template.maxDiscount.toLocaleString()}₫`
                      : "Không giới hạn"
                  }
                />
              </DetailSection>
            </div>

            <div className="space-y-6">
              <DetailSection
                title="Hiệu lực hệ thống"
                icon={<Calendar size={16} />}
              >
                <DataRow
                  label="Bắt đầu"
                  value={dayjs(template.startDate).format("HH:mm - DD/MM/YYYY")}
                />
                <DataRow
                  label="Kết thúc"
                  value={
                    template.endDate
                      ? dayjs(template.endDate).format("HH:mm - DD/MM/YYYY")
                      : "Vô thời hạn"
                  }
                />
                <DataRow
                  label="Thời hạn mua"
                  value={
                    template.validityDays
                      ? `${template.validityDays} ngày`
                      : "N/A"
                  }
                />
                <DataRow
                  label="Trạng thái"
                  value={
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase border",
                        template.active
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                          : "bg-rose-50 border-rose-100 text-rose-600",
                      )}
                    >
                      {template.active ? "Đang vận hành" : "Đã vô hiệu"}
                    </span>
                  }
                />
              </DetailSection>

              <DetailSection
                title="Phạm vi áp dụng"
                icon={<ShieldCheck size={16} />}
              >
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <ScopeTag
                    active={template.applyToAllShops}
                    label="Toàn Shop"
                    icon={<Store size={12} />}
                  />
                  <ScopeTag
                    active={template.applyToAllProducts}
                    label="Toàn SP"
                    icon={<Layers size={12} />}
                  />
                  <ScopeTag
                    active={template.applyToAllCustomers}
                    label="Toàn Khách"
                    icon={<User size={12} />}
                  />
                </div>
              </DetailSection>

              {template.purchasable && (
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 shadow-inner">
                  <span className="text-[10px] font-bold uppercase text-orange-400 block mb-1">
                    Giá bán Protocol
                  </span>
                  <span className="text-xl font-bold text-orange-600 italic underline decoration-orange-300 underline-offset-4">
                    {template.price?.toLocaleString()} VNĐ
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <InstanceList
              instances={voucherInfo?.instances || []}
              loading={isLoading}
              onUseInstance={(inst) => onUseInstance(inst.id)}
            />
          </div>
        )}
      </div>
    </PortalModal>
  );
};

// --- Sub-components UI ---

const DetailSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-4">
      <div className="text-orange-500">{icon}</div>
      <h4 className="text-[11px] font-bold uppercase tracking-widest  text-gray-400">
        {title}
      </h4>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const DataRow = ({
  label,
  value,
  bold,
  italic,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
  italic?: boolean;
}) => (
  <div className="flex justify-between items-start gap-4 border-b border-slate-50 pb-2 last:border-none">
    <span className="text-[11px] font-bold  text-gray-400 uppercase tracking-tight shrink-0">
      {label}
    </span>
    <span
      className={cn(
        "text-xs  text-gray-700 text-right min-w-0 wrap-break-words",
        bold && "font-bold uppercase tracking-tighter",
        italic && "italic  text-gray-500",
      )}
    >
      {value}
    </span>
  </div>
);

const ScopeTag = ({
  active,
  label,
  icon,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
}) => (
  <div
    className={cn(
      "flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all",
      active
        ? "bg-orange-50 border-orange-200 text-orange-600 shadow-sm"
        : "bg-slate-50 border-slate-100  text-gray-300",
    )}
  >
    {icon}
    <span className="text-[9px] font-bold uppercase tracking-tighter leading-none">
      {label}
    </span>
    <div
      className={cn(
        "size-1.5 rounded-full mt-1",
        active ? "bg-orange-500 animate-pulse" : "bg-slate-200",
      )}
    />
  </div>
);
