"use client";

import React from "react";
import dayjs from "dayjs";
import {
  ShieldCheck,
  Hash,
  FileText,
  Activity,
  User,
  Calendar,
  ClipboardCheck,
  History,
  X,
  Clock,
} from "lucide-react";
import { Permission } from "../../../_types/dto/rbac.dto";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { Button } from "@/components/button";

interface PermissionDetailModalProps {
  permission: Permission | null;
  open: boolean;
  onClose: () => void;
}

const InfoField = ({
  label,
  value,
  icon: Icon,
  className = "",
  isBadge = false,
  badgeColor = "",
}: any) => (
  <div
    className={cn(
      "p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-orange-200 transition-all duration-300 group",
      className,
    )}
  >
    <div className="flex items-center gap-2 mb-1.5">
      <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
        <Icon size={12} strokeWidth={2.5} />
      </div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </label>
    </div>
    <div className="flex items-center">
      {isBadge ? (
        <span
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border",
            badgeColor,
          )}
        >
          {value}
        </span>
      ) : (
        <span className="text-gray-800 font-bold text-sm leading-tight break-all">
          {value || (
            <span className="text-gray-300 font-normal italic">N/A</span>
          )}
        </span>
      )}
    </div>
  </div>
);

export const PermissionDetailModal = ({
  permission,
  open,
  onClose,
}: PermissionDetailModalProps) => {
  if (!permission) return null;

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-linear-to-br from-orange-400 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-200">
            <ShieldCheck size={22} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 uppercase text-lg leading-none tracking-tight">
              Chi tiết quyền hạn
            </span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
              Role-Based Access Control
            </span>
          </div>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="w-full flex justify-end">
          <Button
            variant="edit"
            onClick={onClose}
            className="rounded-xl px-8 h-10 font-bold uppercase text-[10px] tracking-widest border-gray-200"
          >
            Đóng cửa sổ
          </Button>
        </div>
      }
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* --- SECTION 1: IDENTITY CARD --- */}
        <div className="relative p-6 rounded-4xl bg-linear-to-br from-gray-900 via-gray-800 to-orange-950 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full -mr-24 -mt-24 blur-3xl" />

          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-orange-400 font-mono text-xs font-bold uppercase tracking-widest">
                ID: #{permission.permissionId.split("-")[0]}
              </span>
              <div
                className={cn(
                  "px-4 py-1.5 rounded-full border-2 text-[10px] font-bold uppercase tracking-tighter shadow-xl",
                  permission.isDeleted
                    ? "bg-rose-500 border-rose-400 text-white shadow-rose-500/20"
                    : "bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20",
                )}
              >
                {permission.isDeleted ? "Đã vô hiệu" : "Đang hoạt động"}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic leading-none">
                {permission.permissionName}
              </h2>
              <p className="text-gray-400 font-medium text-sm mt-3 flex items-start gap-2 bg-white/5 p-3 rounded-2xl border border-white/5">
                <FileText
                  size={16}
                  className="text-orange-500 shrink-0 mt-0.5"
                />
                {permission.description ||
                  "Quyền hạn này chưa được cập nhật mô tả chi tiết."}
              </p>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: SYSTEM LOGS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <ClipboardCheck size={14} className="text-orange-500" />
              <h3 className="font-bold text-gray-800 uppercase text-[10px] tracking-[0.2em]">
                Khởi tạo hệ thống
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <InfoField
                label="Người tạo"
                value={permission.createdBy || "SYSTEM"}
                icon={User}
              />
              <InfoField
                label="Thời gian tạo"
                value={dayjs(permission.createdDate).format(
                  "DD/MM/YYYY HH:mm:ss",
                )}
                icon={Calendar}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <History size={14} className="text-orange-500" />
              <h3 className="font-bold text-gray-800 uppercase text-[10px] tracking-[0.2em]">
                Cập nhật cuối
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <InfoField
                label="Người chỉnh sửa"
                value={permission.lastModifiedBy || "SYSTEM"}
                icon={Activity}
              />
              <InfoField
                label="Lần cuối lúc"
                value={dayjs(permission.lastModifiedDate).format(
                  "DD/MM/YYYY HH:mm:ss",
                )}
                icon={Clock}
              />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-4xl bg-orange-50/50 border border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">
              Định danh kĩ thuật
            </span>
          </div>
          <code className="text-[11px] font-bold text-orange-600 bg-white px-3 py-1 rounded-lg border border-orange-200">
            {permission.permissionId}
          </code>
        </div>
      </div>
    </PortalModal>
  );
};
