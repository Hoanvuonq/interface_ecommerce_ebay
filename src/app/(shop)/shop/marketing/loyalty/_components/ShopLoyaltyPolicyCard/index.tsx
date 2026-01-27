"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Edit2,
  Save,
  X,
  Gift,
  Percent,
  Hash,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronRight,
  Info,
  ShieldCheck,
} from "lucide-react";
import { loyaltyService } from "../../_services/loyalty.service";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import type {
  LoyaltyPolicyRequest,
  LoyaltyPolicyResponse,
  LoyaltyRuleType,
} from "../../_types/loyalty.types";

interface ShopLoyaltyPolicyCardProps {
  onPolicyChange?: (policy: LoyaltyPolicyResponse | null) => void;
}

const ShopLoyaltyPolicyCard: React.FC<ShopLoyaltyPolicyCardProps> = ({
  onPolicyChange,
}) => {
  const [policy, setPolicy] = useState<LoyaltyPolicyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  // Form states thủ công
  const [formData, setFormData] = useState<LoyaltyPolicyRequest>({
    enabled: true,
    ruleType: "PERCENT",
    ruleValue: 1,
    expiryDays: 365,
  });

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
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
  };

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
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-100 flex flex-col items-center justify-center gap-4 shadow-sm">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className=" text-gray-400 font-medium italic text-sm">
          Đang tải cấu hình...
        </p>
      </div>
    );
  }

  if (!policy && !isEditing) {
    return (
      <div className="bg-orange-50 border border-orange-100 rounded-4xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm shadow-orange-100/50 transition-all hover:shadow-md">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm shadow-orange-200/50 shrink-0">
          <Gift size={32} strokeWidth={1.5} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-orange-900 leading-tight">
            Bắt đầu tích điểm ngay!
          </h3>
          <p className="text-sm text-orange-800/70 mt-1">
            Khách hàng của bạn chưa thể tích điểm. Hãy tạo chính sách đầu tiên
            để thúc đẩy doanh số.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className={cn(
            "px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs",
            "uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95"
          )}
        >
          Thiết lập ngay
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5  text-gray-400" />
            <h2 className="font-bold  text-gray-800 tracking-tight">
              Cấu hình Tích điểm
            </h2>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className=" text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rule Type */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest  text-gray-400 ml-1">
                Loại quy tắc
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                {(["PERCENT", "FIXED"] as LoyaltyRuleType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, ruleType: type })}
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all",
                      formData.ruleType === type
                        ? "bg-white text-orange-600 shadow-sm"
                        : " text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {type === "PERCENT" ? (
                      <Percent size={14} />
                    ) : (
                      <Hash size={14} />
                    )}
                    {type === "PERCENT" ? "Phần trăm" : "Cố định"}
                  </button>
                ))}
              </div>
            </div>

            {/* Rule Value */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest  text-gray-400 ml-1">
                Giá trị tích lũy
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.ruleValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ruleValue: Number(e.target.value),
                    })
                  }
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="VD: 5"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2  text-gray-400 font-bold">
                  {formData.ruleType === "PERCENT" ? "%" : "điểm"}
                </span>
              </div>
            </div>

            {/* Expiry Days */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest  text-gray-400 ml-1 flex items-center gap-2">
                <Calendar size={12} /> Thời hạn sử dụng điểm
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.expiryDays}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiryDays: Number(e.target.value),
                    })
                  }
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2  text-gray-400 text-xs font-bold">
                  NGÀY
                </span>
              </div>
            </div>

            {/* Max Discount */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest  text-gray-400 ml-1">
                % Giảm tối đa / đơn
              </label>
              <input
                type="number"
                value={formData.maxDiscountPercent || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDiscountPercent: Number(e.target.value),
                  })
                }
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                placeholder="Không giới hạn"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-50">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3  text-gray-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-10 py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- VIEW: HIỂN THỊ CHÍNH SÁCH ---
  if (!policy) {
    return null;
  }

  return (
    <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* Header View */}
      <div className="px-8 py-7 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm shadow-orange-200">
            <Gift size={28} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold  text-gray-800 tracking-tight">
                Chính sách Điểm thưởng
              </h2>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  policy.enabled
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-slate-100  text-gray-400 border-slate-200"
                )}
              >
                {policy.enabled ? "Đang hoạt động" : "Tạm ngắt"}
              </span>
            </div>
            <p className="text-sm  text-gray-400 font-medium mt-0.5 italic">
              Cấu hình cách khách hàng nhận và dùng điểm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold  text-gray-400 uppercase tracking-widest">
              Trạng thái
            </span>
            <button
              onClick={handleToggle}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                policy.enabled ? "bg-orange-500" : "bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md",
                  policy.enabled ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            <Edit2 size={14} /> Chỉnh sửa
          </button>
        </div>
      </div>

      {/* Body View */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-orange-200 transition-colors">
            <div className="flex items-center gap-3  text-gray-400 mb-3 group-hover:text-orange-500 transition-colors">
              {policy.ruleType === "FIXED" ? (
                <Hash size={18} />
              ) : (
                <Percent size={18} />
              )}
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Quy tắc tích lũy
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold  text-gray-800">
                {policy.ruleValue}
              </span>
              <span className="text-sm font-bold  text-gray-400 uppercase">
                {policy.ruleType === "FIXED" ? "điểm / đơn" : "% đơn hàng"}
              </span>
            </div>
            <p className="text-[11px]  text-gray-400 mt-2 font-medium">
              Mỗi đơn hàng thành công sẽ nhận được số điểm này.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-orange-200 transition-colors">
            <div className="flex items-center gap-3  text-gray-400 mb-3 group-hover:text-orange-500 transition-colors">
              <Calendar size={18} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Hiệu lực điểm
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold  text-gray-800">
                {policy.expiryDays}
              </span>
              <span className="text-sm font-bold  text-gray-400 uppercase">
                Ngày
              </span>
            </div>
            <p className="text-[11px]  text-gray-400 mt-2 font-medium">
              Điểm sẽ tự động bị xóa sau thời gian này nếu không dùng.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-orange-200 transition-colors">
            <div className="flex items-center gap-3  text-gray-400 mb-3 group-hover:text-orange-500 transition-colors">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Giới hạn dùng
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold  text-gray-800">
                {policy.maxDiscountPercent || 100}
              </span>
              <span className="text-sm font-bold  text-gray-400 uppercase">
                % tối đa
              </span>
            </div>
            <p className="text-[11px]  text-gray-400 mt-2 font-medium">
              Tỷ lệ giảm giá tối đa khách có thể áp dụng bằng điểm.
            </p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-8 p-5 bg-orange-50/30 border border-orange-100 rounded-2xl flex items-start gap-4">
          <Info size={18} className="text-orange-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-orange-900 uppercase tracking-tight">
              Chi tiết vận hành
            </h4>
            <p className="text-[12px] text-orange-800/70 mt-1 leading-relaxed">
              Khi khách hàng mua hàng, hệ thống sẽ tính{" "}
              <strong>
                {policy.ruleType === "FIXED"
                  ? `${policy.ruleValue} điểm`
                  : `${policy.ruleValue}% giá trị`}
              </strong>{" "}
              và chuyển vào trạng thái "Chờ xử lý". Điểm chính thức khả dụng sau
              khi đơn hàng hoàn tất.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopLoyaltyPolicyCard;
