"use client";

import { Button } from "@/components/button";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import {
  Activity,
  Calendar,
  FileText,
  Fingerprint,
  History,
  ShieldCheck,
  User,
  UserCircle2
} from "lucide-react";
import type { Role } from "../../../_types/dto/rbac.dto";
import { DetailCard } from "../DetailCard";

interface RoleDetailModalProps {
  role: Role | null;
  open: boolean;
  onClose: () => void;
}

export const RoleDetailModal = ({
  role,
  open,
  onClose,
}: RoleDetailModalProps) => {
  if (!role) return null;

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
            <UserCircle2 size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 uppercase text-lg leading-none tracking-tight">
              Chi tiết vai trò
            </span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
              System Role Information
            </span>
          </div>
        </div>
      }
      width="max-w-3xl"
      footer={
        <div className="w-full flex justify-end">
          <Button
            variant="edit"
            onClick={onClose}
            className="rounded-xl px-8 h-10 font-bold uppercase text-[10px] tracking-widest border-gray-200"
          >
            Đóng thông tin
          </Button>
        </div>
      }
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* --- HERO SECTION: IDENTITY --- */}
        <div className="relative p-6 rounded-4xl bg-linear-to-br from-gray-900 via-gray-800 to-orange-950 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full -mr-24 -mt-24 blur-3xl" />

          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-orange-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                UID: {role.roleId.split("-")[0].toUpperCase()}
              </span>
              <div
                className={cn(
                  "px-4 py-1.5 rounded-full border-2 text-[10px] font-bold uppercase tracking-tighter shadow-xl",
                  role.isDeleted
                    ? "bg-rose-500 border-rose-400 text-white shadow-rose-500/20"
                    : "bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20",
                )}
              >
                {role.isDeleted ? "Đã vô hiệu" : "Đang hoạt động"}
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic leading-none">
                {role.roleName}
              </h2>
              <div className="inline-flex items-center gap-2 mt-4 bg-white/5 p-3 rounded-2xl border border-white/5 w-full">
                <FileText size={16} className="text-orange-500 shrink-0" />
                <p className="text-gray-300 font-medium text-sm">
                  {role.description ||
                    "Chưa có mô tả chi tiết cho vai trò này."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <ShieldCheck size={14} className="text-orange-500" />
              <h3 className="font-bold text-gray-800 uppercase text-[10px] tracking-[0.2em]">
                Cấu hình hệ thống
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <DetailCard
                label="Mã định danh (Full ID)"
                value={role.roleId}
                icon={Fingerprint}
              />
              <DetailCard
                label="Trạng thái thực thi"
                value={role.isDeleted ? "Ngừng hoạt động" : "Sẵn sàng cấp phát"}
                icon={Activity}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <History size={14} className="text-orange-500" />
              <h3 className="font-bold text-gray-800 uppercase text-[10px] tracking-[0.2em]">
                Lịch sử vận hành
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <DetailCard
                  label="Người tạo"
                  value={role.createdBy || "SYSTEM"}
                  icon={User}
                />
                <DetailCard
                  label="Sửa cuối"
                  value={role.lastModifiedBy || "SYSTEM"}
                  icon={User}
                />
              </div>
              <DetailCard
                label="Ngày khởi tạo"
                value={dayjs(role.createdDate).format("DD/MM/YYYY - HH:mm")}
                icon={Calendar}
              />
              <DetailCard
                label="Cập nhật lần cuối"
                value={dayjs(role.lastModifiedDate).format(
                  "DD/MM/YYYY - HH:mm",
                )}
                icon={Calendar}
              />
            </div>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
