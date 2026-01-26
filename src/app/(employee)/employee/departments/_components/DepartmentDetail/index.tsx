"use client";

import React, { useEffect, useState } from "react";
import { useGetDepartmentDetail } from "../../_hooks/useDepartment";
import dayjs from "dayjs";
import { DepartmentDetail as DepartmentDetailType } from "../../_types/department.type";
import PositionManagement from "../PositionManagement";
import { PortalModal } from "@/features/PortalModal";
import { SectionHeader } from "@/components";
import { cn } from "@/utils/cn";
import { Loader2, Users, Briefcase, Calendar, Info } from "lucide-react";
import { FaUserEdit } from "react-icons/fa";
import { useToast } from "@/hooks/useToast";

interface DepartmentDetailProps {
  open: boolean;
  departmentId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function DepartmentDetail({
  open,
  departmentId,
  onClose,
  onUpdated,
}: DepartmentDetailProps) {
  const { handleGetDepartmentDetail, loading } = useGetDepartmentDetail();
  const { error: toastError } = useToast();
  const [department, setDepartment] = useState<DepartmentDetailType | null>(
    null,
  );

  const fetchDepartmentDetail = async () => {
    if (!departmentId) return;
    const res = await handleGetDepartmentDetail(departmentId);
    if (res?.data) {
      setDepartment(res.data);
    } else {
      toastError("Không thể tải chi tiết phòng ban!");
    }
  };

  useEffect(() => {
    if (open && departmentId) {
      fetchDepartmentDetail();
    }
  }, [open, departmentId]);

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title="Chi tiết & Quản trị Phòng ban"
      width="max-w-5xl"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-orange-500" size={40} />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">
            Đang truy xuất dữ liệu...
          </span>
        </div>
      ) : department ? (
        <div className="space-y-8 pb-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-gray-50/50 p-6 rounded-4xl border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-semibold text-gray-900 tracking-tighter uppercase italic leading-none mb-2">
                  {department.departmentName}
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {department.description ||
                    "Phòng ban này chưa có mô tả chi tiết nội bộ."}
                </p>
              </div>
              <div className="flex gap-4 mt-6">
                <BadgeInfo
                  icon={<Users size={14} />}
                  label="Nhân sự"
                  value={department.totalEmployees || 0}
                  color="text-emerald-600"
                  bgColor="bg-emerald-50"
                />
                <BadgeInfo
                  icon={<Briefcase size={14} />}
                  label="Chức vụ"
                  value={department.totalPositions || 0}
                  color="text-purple-600"
                  bgColor="bg-purple-50"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm space-y-4">
              <SectionHeader icon={Info} title="Metadata" />
              <div className="space-y-3">
                <MetaItem
                  icon={<Calendar size={12} />}
                  label="Ngày khởi tạo"
                  value={dayjs(department.createdDate).format("DD/MM/YYYY")}
                />
                <MetaItem
                  icon={<FaUserEdit size={12} />}
                  label="Người quản lý"
                  value={department.createdBy || "System"}
                />
                <MetaItem
                  icon={<Calendar size={12} />}
                  label="Cập nhật cuối"
                  value={dayjs(department.lastModifiedDate).format(
                    "DD/MM/YYYY",
                  )}
                />
              </div>
            </div>
          </div>

          {/* 2. Position Management Area */}
          <div className="relative pt-4">
            <PositionManagement
              departmentId={department.departmentId}
              positions={department.positions}
              onUpdated={() => {
                fetchDepartmentDetail();
                onUpdated?.();
              }}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl font-semibold uppercase text-[10px] tracking-widest text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-gray-600 font-bold uppercase text-xs tracking-widest">
          Không có dữ liệu hiển thị.
        </div>
      )}
    </PortalModal>
  );
}

const BadgeInfo = ({ icon, label, value, color, bgColor }: any) => (
  <div
    className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-2xl border border-transparent transition-all hover:border-gray-200",
      bgColor,
    )}
  >
    <div className={cn("p-2 rounded-xl bg-white shadow-sm", color)}>{icon}</div>
    <div>
      <p className="text-[9px] font-semibold uppercase tracking-tighter text-gray-600 leading-none">
        {label}
      </p>
      <p
        className={cn(
          "text-lg font-semibold italic tracking-tighter leading-none mt-1",
          color,
        )}
      >
        {value}
      </p>
    </div>
  </div>
);

const MetaItem = ({ icon, label, value }: any) => (
  <div className="flex items-center justify-between py-1 border-b border-dashed border-gray-100 last:border-none">
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {label}
      </span>
    </div>
    <span className="text-[11px] font-semibold text-gray-700 italic">
      {value}
    </span>
  </div>
);
