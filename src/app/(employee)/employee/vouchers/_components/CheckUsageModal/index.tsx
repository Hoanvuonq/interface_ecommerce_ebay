"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Zap,
  CheckCircle2,
  XCircle,
  Info,
  Activity,
  Layers,
  Database,
  ArrowRight,
  Hash,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import type { VoucherInfoResponse } from "../../_types/voucher-v2.type";
import { PortalModal } from "@/features/PortalModal";
import { FormInput, CustomButtonActions } from "@/components";
import { cn } from "@/utils/cn";
import { InfoItem } from "../InfoItem";

interface CheckUsageModalProps {
  open: boolean;
  onClose: () => void;
  onCheckUsage?: (templateId: string) => Promise<boolean>;
  onGetInfo: (templateId: string) => Promise<VoucherInfoResponse>;
  loading?: boolean;
}

export const CheckUsageModal = ({
  open,
  onClose,
  onCheckUsage,
  onGetInfo,
}: CheckUsageModalProps) => {
  const [templateId, setTemplateId] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    isUsable: boolean;
    info?: VoucherInfoResponse;
  } | null>(null);

  useEffect(() => {
    if (!open) {
      setTemplateId("");
      setResult(null);
    }
  }, [open]);

  const handleCheck = async () => {
    if (!templateId || templateId.length < 10) return;

    setChecking(true);
    try {
      const [isUsable, infoResponse] = await Promise.all([
        onCheckUsage?.(templateId),
        onGetInfo(templateId),
      ]);

      setResult({
        isUsable: isUsable ?? false,
        info: infoResponse,
      });
    } catch (error) {
      console.error("Check usage error:", error);
    } finally {
      setChecking(false);
    }
  };

  const handleClose = () => {
    setTemplateId("");
    setResult(null);
    onClose();
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={handleClose}
      width="max-w-2xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
            <Zap size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold uppercase tracking-tight text-gray-800">
            Kiểm tra khả dụng Voucher
          </span>
        </div>
      }
      footer={
        <CustomButtonActions
          onCancel={handleClose}
          onSubmit={handleCheck}
          isLoading={checking}
          isDisabled={templateId.length < 10}
          submitText="Bắt đầu kiểm tra"
          submitIcon={Search}
          containerClassName="w-full flex gap-3 border-t-0"
          className="w-48! h-12 rounded-4xl"
        />
      }
    >
      <div className="space-y-8 py-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Database size={16} className="text-orange-500" />
            <h3 className="text-[12px] font-bold text-gray-400">
              Định danh dữ liệu
            </h3>
          </div>
          <FormInput
            placeholder="Nhập ID mẫu voucher (Tối thiểu 10 ký tự)..."
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
        </div>

        {result && !checking && (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6">
            <div
              className={cn(
                "p-8 rounded-[2.5rem] border flex flex-col items-center text-center gap-5 transition-all shadow-2xl",
                result.isUsable
                  ? "bg-emerald-50/50 border-emerald-100 shadow-emerald-100/50"
                  : "bg-orange-50/50 border-orange-100 shadow-orange-100/50",
              )}
            >
              {/* Icon hiển thị theo logic Usable */}
              <div
                className={cn(
                  "p-5 rounded-full shadow-lg ring-8",
                  result.isUsable
                    ? "bg-white text-emerald-500 ring-emerald-50"
                    : "bg-white text-orange-500 ring-orange-50",
                )}
              >
                {result.isUsable ? (
                  <CheckCircle2 size={48} strokeWidth={2.5} />
                ) : (
                  <AlertCircle size={48} strokeWidth={2.5} />
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <h4
                    className={cn(
                      "text-2xl font-bold uppercase italic tracking-tighter",
                      result.isUsable ? "text-emerald-700" : "text-orange-700",
                    )}
                  >
                    {result.isUsable
                      ? "Protocol Validated"
                      : "System Restriction"}
                  </h4>

                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={cn(
                        "size-2 rounded-full animate-pulse",
                        result.info?.template.active
                          ? "bg-emerald-500"
                          : "bg-slate-300",
                      )}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest  text-gray-400">
                      System Status:{" "}
                      {result.info?.template.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {!result.isUsable && (
                  <div className="px-4 py-2 bg-white/80 rounded-2xl border border-orange-200 inline-block shadow-sm">
                    <p className="text-[11px] font-bold text-orange-600 uppercase tracking-tight">
                      Lỗi:{" "}
                      {result.info?.reason ||
                        "Voucher chưa có thực thể (Instance) hoặc hết lượt dùng"}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {result.info && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={<Activity size={14} />}
                  label="Mã & Tên"
                  value={
                    <div className="flex flex-col">
                      <span className="text-blue-600 font-mono font-bold">
                        {result.info.template.code}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate">
                        {result.info.template.name}
                      </span>
                    </div>
                  }
                />
                <InfoItem
                  icon={<Layers size={14} />}
                  label="Ưu đãi"
                  value={
                    <span className="font-bold text-orange-600">
                      {result.info.template.discountType === "PERCENTAGE"
                        ? `${result.info.template.discountValue}%`
                        : `${result.info.template.discountValue.toLocaleString()}₫`}
                    </span>
                  }
                />
                <InfoItem
                  icon={<Info size={14} />}
                  label="Trạng thái"
                  value={
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase",
                        result.info.template.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-gray-500",
                      )}
                    >
                      {result.info.template.active ? "Đang chạy" : "Đã tắt"}
                    </span>
                  }
                />
                <InfoItem
                  icon={<Hash size={14} />}
                  label="Thực thể (Instances)"
                  value={
                    <span className="font-bold">
                      {result.info.instances.length} bản ghi
                    </span>
                  }
                />
              </div>
            )}

            {result.info && (
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-slate-100 transition-colors">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                    Sức chứa còn lại (Total Free)
                  </p>
                  <p className="text-2xl font-bold text-gray-800 tabular-nums italic">
                    {result.info.instances
                      .reduce(
                        (sum, inst) =>
                          sum + (inst.totalQuantity - inst.usedQuantity),
                        0,
                      )
                      .toLocaleString()}
                  </p>
                </div>
                <div className="size-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-300 group-hover:text-orange-500 transition-colors">
                  <ArrowRight size={24} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PortalModal>
  );
};
