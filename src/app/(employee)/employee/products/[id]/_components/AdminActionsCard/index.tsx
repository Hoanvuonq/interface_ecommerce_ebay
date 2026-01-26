"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Edit3,
  ShieldCheck,
  AlertTriangle,
  MessageSquareQuote,
  Zap,
} from "lucide-react";
import { ButtonField, FormInput } from "@/components";
import { cn } from "@/utils/cn";

interface AdminActionsCardProps {
  onApprove: () => void;
  onReject: (reason: string) => void;
  onRequestEdit: (reason: string) => void;
  loading?: boolean;
  isApproved?: boolean;
}

export const AdminActionsCard = ({
  onApprove,
  onReject,
  onRequestEdit,
  loading = false,
  isApproved = false,
}: AdminActionsCardProps) => {
  const [reason, setReason] = useState("");

  return (
    <div className="bg-white rounded-4xl p-6 shadow-custom border border-gray-100 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
      {/* Glow Effect nền tạo điểm nhấn công nghệ */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header: Tinh gọn và quyền lực */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-800 leading-none">
              Trung tâm <span className="text-orange-500">Kiểm duyệt</span>
            </h3>
            <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">
              Verification Protocol v2.1
            </p>
          </div>
        </div>

        {isApproved && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 animate-in zoom-in">
            <CheckCircle size={12} strokeWidth={3} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Đã phê duyệt
            </span>
          </div>
        )}
      </div>

      {!isApproved && (
        <div className="mb-6 m-auto">
          <ButtonField
            htmlType="submit"
            type="login"
            onClick={onApprove}
            disabled={loading}
            className="flex w-70 m-auto h-12 items-center gap-2 px-5 py-8rounded-lg text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 "
          >
            <span className="flex items-center gap-2">
              <Zap size={16} className="fill-current" />
              Phê duyệt sản phẩm ngay
            </span>
          </ButtonField>
        </div>
      )}

      {/* Feedback Area */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 ml-1">
          <MessageSquareQuote size={14} className="text-orange-500" />
          <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
            Ghi chú kiểm duyệt
          </span>
        </div>
        <FormInput
          isTextArea={true}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do chi tiết nếu cần Shop điều chỉnh thông tin (Hình ảnh, danh mục, giá...)"
          className="min-h-24 bg-gray-50/50 border-gray-100 rounded-2xl text-xs font-semibold focus:bg-white transition-all shadow-inner"
        />
      </div>

      {/* Secondary Actions: Hai nút thu gọn nằm cạnh nhau chuyên nghiệp */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onReject(reason)}
          disabled={loading || !reason.trim()}
          className={cn(
            "flex items-center justify-center gap-2 h-12 rounded-xl transition-all border font-bold text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:grayscale",
            "bg-white border-gray-100 text-rose-500 hover:bg-rose-50 hover:border-rose-100 shadow-sm active:scale-95",
          )}
        >
          <XCircle size={14} strokeWidth={2.5} />
          Từ chối
        </button>

        <button
          onClick={() => onRequestEdit(reason)}
          disabled={loading || !reason.trim()}
          className={cn(
            "flex items-center justify-center gap-2 h-12 rounded-xl transition-all border font-bold text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:grayscale",
            "bg-white border-gray-100 text-amber-600 hover:bg-amber-50 hover:border-amber-100 shadow-sm active:scale-95",
          )}
        >
          <Edit3 size={14} strokeWidth={2.5} />
          Yêu cầu sửa
        </button>
      </div>

      {!isApproved && !reason.trim() && (
        <div className="mt-4 flex items-center justify-center gap-2 opacity-50">
          <AlertTriangle size={10} className="text-amber-500" />
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter italic">
            Vui lòng nhập lý do để mở khóa các tùy chọn xử lý
          </p>
        </div>
      )}
    </div>
  );
};
