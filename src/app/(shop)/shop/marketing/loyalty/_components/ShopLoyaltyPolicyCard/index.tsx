/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ButtonField, FormInput, SectionLoading } from "@/components";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  Calendar,
  Edit2,
  Gift,
  Hash,
  Info,
  Loader2,
  Percent,
  Save,
  Settings,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { loyaltyService } from "../../_services/loyalty.service";
import type {
  LoyaltyPolicyRequest,
  LoyaltyPolicyResponse,
  LoyaltyRuleType,
} from "../../_types/loyalty.types";
import {
  SmartKPICard,
  StatusTabItem,
  StatusTabs,
} from "@/app/(shop)/shop/_components";

interface ShopLoyaltyPolicyCardProps {
  onPolicyChange?: (policy: LoyaltyPolicyResponse | null) => void;
}

export const ShopLoyaltyPolicyCard: React.FC<ShopLoyaltyPolicyCardProps> = ({
  onPolicyChange,
}) => {
  const [policy, setPolicy] = useState<LoyaltyPolicyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const [formData, setFormData] = useState<LoyaltyPolicyRequest>({
    enabled: true,
    ruleType: "PERCENT",
    ruleValue: 1,
    expiryDays: 365,
  });

  const fetchPolicy = useCallback(async () => {
    setLoading(true);
    try {
      const data = await loyaltyService.getPolicy();
      setPolicy(data);
      onPolicyChange?.(data);
      if (data) {
        setFormData({
          enabled: data.enabled,
          ruleType: data.ruleType,
          ruleValue: data.ruleValue,
          expiryDays: data.expiryDays,
          maxPointPerOrder: data.maxPointPerOrder,
          maxDiscountPercent: data.maxDiscountPercent,
        });
      }
    } catch (error) {
      console.error("Failed to fetch policy:", error);
    } finally {
      setLoading(false);
    }
  }, [onPolicyChange]);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  const handleToggle = async () => {
    try {
      const result = await loyaltyService.togglePolicy();
      setPolicy(result);
      onPolicyChange?.(result);
      toastSuccess(`Chương trình đã ${result.enabled ? "bật" : "tắt"}`);
    } catch (error) {
      toastError("Không thể thay đổi trạng thái");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let result: LoyaltyPolicyResponse;
      if (policy) {
        result = await loyaltyService.updatePolicy(formData);
        toastSuccess("Cập nhật thành công");
      } else {
        result = await loyaltyService.createPolicy(formData);
        toastSuccess("Tạo chính sách thành công");
      }
      setPolicy(result);
      onPolicyChange?.(result);
      setIsEditing(false);
    } catch (error) {
      toastError("Lỗi khi lưu chính sách");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SectionLoading size="md" message="Đang tải cấu hình..." />;
  }
  const ruleTypeTabs: StatusTabItem<LoyaltyRuleType>[] = [
    { key: "PERCENT", label: "Phần trăm", icon: Percent },
    { key: "FIXED", label: "Cố định", icon: Hash },
  ];

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm text-orange-500">
              <Settings size={18} />
            </div>
            <h2 className="font-bold text-slate-800 uppercase tracking-tighter">
              Cấu hình Tích điểm
            </h2>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Loại quy tắc
              </label>

              <StatusTabs
                tabs={ruleTypeTabs}
                current={formData.ruleType}
                onChange={(key) => setFormData({ ...formData, ruleType: key })}
                layoutId="rule-type-toggle"
                className="pb-0"
              />
            </div>

            <FormInput
              label="Giá trị tích lũy"
              type="number"
              required
              value={formData.ruleValue}
              onChange={(e: any) =>
                setFormData({ ...formData, ruleValue: Number(e.target.value) })
              }
              placeholder="VD: 5"
              className="text-lg font-bold text-orange-600"
            />
            <FormInput
              label="Thời hạn điểm (Ngày)"
              type="number"
              required
              value={formData.expiryDays}
              onChange={(e: any) =>
                setFormData({ ...formData, expiryDays: Number(e.target.value) })
              }
              placeholder="365"
            />
            <FormInput
              label="% Giảm tối đa / đơn"
              type="number"
              value={formData.maxDiscountPercent || ""}
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  maxDiscountPercent: Number(e.target.value),
                })
              }
              placeholder="Không giới hạn"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-50">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-8 py-3.5 text-slate-500 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-12 py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center gap-3"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}{" "}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  // 🟢 CASE 3: Chưa có chính sách (Empty State)
  if (!policy) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-3xl p-4 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-orange-500 shadow-xl shrink-0">
          <Gift size={40} strokeWidth={1.5} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-orange-950 uppercase tracking-tight">
            Kích hoạt tích điểm ngay!
          </h3>
          <p className="text-sm text-orange-800/60 mt-2 font-medium">
            Biến mỗi đơn hàng thành niềm vui cho khách hàng.
          </p>
        </div>
        <ButtonField
          htmlType="submit"
          type="login"
          onClick={() => setIsEditing(true)}
          className="w-56 py-4 font-bold text-[11px] uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3"
        >
          <span className="flex gap-2 items-center">
            <Zap size={16} fill="currentColor" /> Thiết lập ngay
          </span>
        </ButtonField>
      </div>
    );
  }

  // 🟢 CASE 4: HIỂN THỊ CHÍNH SÁCH (Đã có policy, TypeScript sẽ không báo lỗi ở đây)
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-700">
      <div className="px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/40 border-b border-slate-100/60">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-linear-to-br from-orange-50 to-orange-100 rounded-[1.8rem] flex items-center justify-center text-orange-600 shadow-inner">
            <Gift size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tighter uppercase italic">
                Chính sách thưởng
              </h2>
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-bold uppercase border-2",
                  policy.enabled
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-slate-100 text-slate-400 border-slate-200",
                )}
              >
                {policy.enabled ? "Đang chạy" : "Đã dừng"}
              </div>
            </div>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest opacity-70 flex items-center gap-2">
              <Sparkles size={12} className="text-orange-400" /> Cấu hình vận
              hành tự động
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Trạng thái
            </span>
            <button
              onClick={handleToggle}
              className={cn(
                "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-500",
                policy.enabled
                  ? "bg-orange-500 shadow-lg shadow-orange-100"
                  : "bg-slate-200",
              )}
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-500 shadow-sm",
                  policy.enabled ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            <Edit2 size={14} strokeWidth={3} /> Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SmartKPICard
            icon={
              policy.ruleType === "FIXED" ? (
                <Hash size={20} />
              ) : (
                <Percent size={20} />
              )
            }
            title="Quy tắc tích lũy"
            value={policy.ruleValue}
            suffix={policy.ruleType === "FIXED" ? "Điểm/Đơn" : "% Giá trị"}
            colorTheme="orange"
            loading={loading}
          />

          <SmartKPICard
            icon={<Calendar size={20} />}
            title="Hiệu lực điểm"
            value={policy.expiryDays}
            suffix="Ngày"
            colorTheme="blue"
            loading={loading}
          />

          <SmartKPICard
            icon={<Zap size={20} />}
            title="Giới hạn giảm"
            value={policy.maxPointPerOrder || 100}
            suffix="%"
            colorTheme="purple"
            loading={loading}
          />
        </div>

        <div className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-4xl flex items-start gap-5">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-500">
            <Info size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-blue-900 uppercase tracking-widest mb-1">
              Cơ chế vận hành
            </h4>
            <p className="text-[13px] text-blue-800/80 font-medium leading-relaxed italic">
              Hệ thống tính trên giá trị thanh toán thực tế. Điểm chỉ khả dụng
              khi đơn hàng{" "}
              <span className="text-emerald-600 font-bold ml-1">Hoàn tất</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
