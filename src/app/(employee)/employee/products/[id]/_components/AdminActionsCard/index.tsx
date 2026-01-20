"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Edit,
  ShieldCheck,
  Send,
  AlertTriangle,
} from "lucide-react";
import { FormInput, CustomButtonActions } from "@/components";
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
    <div className="bg-white rounded-[2.5rem] p-8 shadow-custom-lg border border-orange-50 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-50 rounded-2xl text-orange-500 shadow-inner">
          <ShieldCheck size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xl font-bold uppercase tracking-tighter text-slate-800 italic leading-none">
            Trung tâm kiểm duyệt
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
            Admin Approval Protocol
          </p>
        </div>
      </div>

      {/* Main Status / Approve Button */}
      <div className="mb-8">
        {isApproved ? (
          <div className="w-full bg-green-50 text-green-700 font-bold uppercase tracking-widest text-xs py-5 rounded-3xl flex items-center justify-center gap-3 border-2 border-green-100 shadow-sm animate-in zoom-in duration-300">
            <CheckCircle size={20} strokeWidth={3} />
            Sản phẩm đã được phê duyệt
          </div>
        ) : (
          <button
            onClick={onApprove}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-sm py-5 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/25 active:scale-[0.98] disabled:opacity-50 border-b-4 border-orange-700"
          >
            <CheckCircle size={20} strokeWidth={3} />
            Phê duyệt sản phẩm ngay
          </button>
        )}
      </div>

      {/* Reason Input using your FormInput component */}
      <div className="space-y-4 mb-8">
        <FormInput
          label="Phản hồi kiểm duyệt"
          isTextArea={true}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do từ chối hoặc các yêu cầu cần Shop chỉnh sửa (VD: Hình ảnh mờ, sai danh mục...)"
          className="min-h-[120px] bg-slate-50/50 border-slate-200 text-sm font-medium"
        />
      </div>

      {/* Secondary Actions using your CustomButtonActions structure */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
        <button
          onClick={() => onReject(reason)}
          disabled={loading || !reason.trim()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-3xl transition-all border-2 group/btn",
            "bg-red-50/50 border-red-100 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 disabled:opacity-40",
          )}
        >
          <XCircle
            size={22}
            className="group-hover/btn:scale-110 transition-transform"
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-center">
            Từ chối vĩnh viễn
          </span>
        </button>

        <button
          onClick={() => onRequestEdit(reason)}
          disabled={loading || !reason.trim()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-3xl transition-all border-2 group/btn",
            "bg-amber-50/50 border-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white hover:border-amber-500 disabled:opacity-40",
          )}
        >
          <Edit
            size={22}
            className="group-hover/btn:scale-110 transition-transform"
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-center">
            Yêu cầu chỉnh sửa
          </span>
        </button>
      </div>

      {/* Warning Tip */}
      {!isApproved && (
        <div className="mt-6 flex items-start gap-2 px-2 opacity-60 italic">
          <AlertTriangle size={12} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-[10px] text-slate-500 leading-tight">
            Vui lòng nhập lý do cụ thể trước khi chọn "Từ chối" hoặc "Yêu cầu
            chỉnh sửa" để Shop có thể nắm bắt thông tin.
          </p>
        </div>
      )}
    </div>
  );
};
