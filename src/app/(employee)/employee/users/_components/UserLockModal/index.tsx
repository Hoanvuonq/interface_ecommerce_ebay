/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Lock, AlertTriangle, Loader2 } from "lucide-react";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { ButtonField } from "@/components";
import { Button } from "@/components/button/button";

interface UserLockModalProps {
  logic: any;
}

export const UserLockModal: React.FC<UserLockModalProps> = ({ logic }) => {
  const { lockModal, lockLoading, updateState, lockUserAction } = logic;

  const handleClose = () => {
    updateState({ lockModal: { ...lockModal, open: false } });
  };

  return (
    <PortalModal
      isOpen={lockModal.open}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
            <Lock size={20} strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight text-lg uppercase text-gray-800">
            Khóa tài khoản
          </span>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button
            type="button"
            variant="edit"
            onClick={handleClose}
            className=" bg-transparent rounded-full"
          >
            Hủy bỏ
          </Button>
          <ButtonField
            htmlType="submit"
            type="login"
            disabled={lockLoading}
            onClick={lockUserAction}
            className="w-50 text-base rounded-full"
          >
            <span className="flex items-center gap-2">
              {lockLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Xác nhận khóa"
              )}
            </span>
          </ButtonField>
        </div>
      }
    >
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
          <div className="p-2 bg-white rounded-xl shadow-sm text-amber-500">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Cảnh báo quan trọng
            </p>
            <p className="text-xs text-amber-600 font-medium leading-relaxed">
              Khi tài khoản bị khóa, người dùng sẽ không thể đăng nhập hoặc thực
              hiện bất kỳ giao dịch nào trên hệ thống.
            </p>
          </div>
        </div>

        {/* Ô nhập lý do */}
        <div className="space-y-3">
          <label className="block text-[11px] font-semibold uppercase  text-gray-600 px-1">
            Lý do khóa tài khoản <span className="text-rose-500">*</span>
          </label>
          <textarea
            className={cn(
              "w-full p-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-rose-500/20 focus:bg-white focus:ring-4 focus:ring-rose-500/5 outline-none text-sm font-bold text-gray-700 h-40 resize-none transition-all placeholder:text-gray-500 placeholder:font-normal",
              lockModal.reason.length < 5 &&
                lockModal.reason.length > 0 &&
                "border-rose-200 bg-rose-50/30"
            )}
            value={lockModal.reason}
            onChange={(e) =>
              updateState({
                lockModal: { ...lockModal, reason: e.target.value },
              })
            }
            placeholder="Ví dụ: Vi phạm điều khoản cộng đồng, có hành vi gian lận trong giao dịch..."
          />
          <div className="flex justify-between px-2">
            <p className="text-[10px] text-gray-600 font-bold italic">
              * Lý do sẽ được gửi thông báo đến email người dùng.
            </p>
            <span
              className={cn(
                "text-[10px] font-semibold tracking-widest",
                lockModal.reason.length > 0
                  ? "text-gray-600"
                  : "text-gray-500"
              )}
            >
              {lockModal.reason.length} ký tự
            </span>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
