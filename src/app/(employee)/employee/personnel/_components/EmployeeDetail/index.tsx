"use client";

import React from "react";
import dayjs from "dayjs";
import { 
  User, 
  Mail, 
  Shield, 
  UserCheck, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building2, 
  Clock,
  ExternalLink
} from "lucide-react";
import {
  genderLabelMap,
  workerTypeLabelMap,
  statusLabelMap,
  statusColorMap,
  Employee,
  userStatusLabelMap,
  userStatusColorMap,
} from "../../_types/employee.type";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { SectionHeader } from "@/components";

interface EmployeeDetailModalProps {
  open: boolean;
  employee?: Employee | null;
  onClose: () => void;
}

const getEmployeeRoles = (employee: Employee | null | undefined): string[] => {
  if (!employee) return [];
  const rawEmployee = employee as any;
  if (rawEmployee.roles?.length > 0) return rawEmployee.roles.map((r: string) => r.toUpperCase());
  if (rawEmployee.roleNames?.length > 0) return rawEmployee.roleNames.map((r: string) => r.toUpperCase());
  if (employee.roleName) return employee.roleName.split(", ").map((r) => r.toUpperCase());
  return [];
};

const getRoleStyle = (role: string) => {
  const roleUpper = role.toUpperCase();
  if (roleUpper === "ADMIN") return "bg-red-50 text-red-600 border-red-100";
  if (roleUpper === "SHOP") return "bg-blue-50 text-blue-600 border-blue-100";
  if (roleUpper === "BUYER") return "bg-emerald-50 text-emerald-600 border-emerald-100";
  return "bg-purple-50 text-purple-600 border-purple-100";
};

export default function EmployeeDetail({
  open,
  employee,
  onClose,
}: EmployeeDetailModalProps) {
  if (!employee) return null;

  const roles = getEmployeeRoles(employee);

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title="Chi tiết nhân sự"
      width="max-w-4xl"
    >
      <div className="space-y-8 pb-4">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-gray-50/50 rounded-4xl border border-gray-100">
          <div className="relative shrink-0 group">
            <div className="w-24 h-24 rounded-4xl overflow-hidden border-4 border-white shadow-xl bg-white">
              {employee.imageUrl ? (
                <img
                  src={toPublicUrl(toSizedVariant(employee.imageUrl, "_orig"))}
                  alt={employee.fullName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-500 font-semibold text-3xl">
                  {employee.fullName?.charAt(0)}
                </div>
              )}
            </div>
            <div className={cn(
              "absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border-2 border-white shadow-sm",
              employee.userStatus === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
            )}>
              {employee.userStatus === "ACTIVE" ? "Hoạt động" : "Bị khóa/Ẩn"}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="text-3xl font-semibold text-gray-900 tracking-tighter uppercase italic leading-none">
              {employee.fullName}
            </h3>
            <div className="flex flex-wrap gap-2">
              {roles.map((role, idx) => (
                <span key={idx} className={cn("px-3 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest border", getRoleStyle(role))}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 px-2">
          <div className="space-y-6">
            <SectionHeader icon={<Shield size={16}/>} title="Tài khoản & Liên hệ" />
            <div className="space-y-4">
              <DetailBox icon={<User size={14}/>} label="Tên đăng nhập" value={employee.username} />
              <DetailBox icon={<Mail size={14}/>} label="Email hệ thống" value={employee.email} />
              <DetailBox icon={<Phone size={14}/>} label="Số điện thoại" value={employee.phone} />
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest ml-1">Trạng thái tài khoản</p>
                <span className={cn(
                  "inline-block px-4 py-1.5 rounded-xl text-xs font-bold border shadow-xs",
                  userStatusColorMap[employee.userStatus] === "green" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                )}>
                  {userStatusLabelMap[employee.userStatus]}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeader icon={<Briefcase size={16}/>} title="Vận hành & Công việc" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailBox icon={<Building2 size={14}/>} label="Phòng ban" value={employee.departmentName} />
                <DetailBox icon={<UserCheck size={14}/>} label="Chức vụ" value={employee.positionName} />
              </div>
              <DetailBox icon={<Clock size={14}/>} label="Hình thức" value={workerTypeLabelMap[employee.type]} />
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest ml-1">Trạng thái làm việc</p>
                <span className={cn(
                  "inline-block px-4 py-1.5 rounded-xl text-xs font-bold border",
                  employee.status === "ACTIVE" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-orange-50 text-orange-700 border-orange-100"
                )}>
                  {statusLabelMap[employee.status]}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <SectionHeader icon={<User size={16}/>} title="Thông tin cá nhân" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DetailBox icon={<Calendar size={14}/>} label="Ngày sinh" value={employee.dateOfBirth ? dayjs(employee.dateOfBirth).format("DD/MM/YYYY") : "-"} />
              <DetailBox icon={<User size={14}/>} label="Giới tính" value={genderLabelMap[employee.gender]} />
              <DetailBox icon={<Clock size={14}/>} label="Ngày bắt đầu" value={employee.startDate ? dayjs(employee.startDate).format("DD/MM/YYYY") : "-"} />
            </div>
            <DetailBox icon={<MapPin size={14}/>} label="Địa chỉ chi tiết" value={employee.addressDetail} isFullWidth />
          </div>
        </div>
      </div>
    </PortalModal>
  );
}


const DetailBox = ({ icon, label, value, isFullWidth = false }: { icon: React.ReactNode; label: string; value?: string; isFullWidth?: boolean }) => (
  <div className={cn("space-y-1.5", isFullWidth ? "w-full" : "")}>
    <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.2em] ml-1 flex items-center gap-1">
      {icon} {label}
    </p>
    <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:border-orange-200 group">
      <span className="text-sm font-bold text-gray-700 leading-none group-hover:text-gray-900">
        {value || "—"}
      </span>
    </div>
  </div>
);