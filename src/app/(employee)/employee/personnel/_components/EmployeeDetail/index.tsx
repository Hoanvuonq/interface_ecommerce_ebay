"use client";

import { FormInput, SectionHeader } from "@/components";
import { PortalModal } from "@/features/PortalModal";
import {
  Employee,
  genderLabelMap,
  statusLabelMap,
  userStatusLabelMap,
  workerTypeLabelMap,
} from "../../_types/employee.type";
import { cn } from "@/utils/cn";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import dayjs from "dayjs";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Hash,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";

interface EmployeeDetailModalProps {
  open: boolean;
  employee?: Employee | null;
  onClose: () => void;
}

const getEmployeeRoles = (employee: Employee | null | undefined): string[] => {
  if (!employee) return [];
  const rawEmployee = employee as any;
  if (rawEmployee.roles?.length > 0)
    return rawEmployee.roles.map((r: string) => r.toUpperCase());
  if (rawEmployee.roleNames?.length > 0)
    return rawEmployee.roleNames.map((r: string) => r.toUpperCase());
  if (employee.roleName)
    return employee.roleName.split(", ").map((r) => r.toUpperCase());
  return [];
};

const getRoleStyle = (role: string) => {
  const roleUpper = role.toUpperCase();
  if (roleUpper === "ADMIN") return "bg-rose-500 text-white shadow-rose-200";
  if (roleUpper === "SHOP") return "bg-blue-500 text-white shadow-blue-200";
  if (roleUpper === "BUYER")
    return "bg-emerald-500 text-white shadow-emerald-200";
  return "bg-orange-500 text-white shadow-orange-200";
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
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
            <UserIcon size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tight text-xl text-gray-800 uppercase italic">
            Hồ sơ <span className="text-orange-500">nhân sự</span>
          </span>
        </div>
      }
      width="max-w-4xl"
    >
      <div className="space-y-8 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative overflow-hidden p-4 rounded-4xl bg-linear-to-br from-gray-900 via-gray-800 to-orange-950 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />

          <div className="relative group shrink-0">
            <div className="w-32 h-32 rounded-[3rem] overflow-hidden border-4 border-whi  te/10 shadow-2xl bg-white/5 relative z-10">
              {employee.imageUrl ? (
                <Image
                  src={toPublicUrl(toSizedVariant(employee.imageUrl, "_orig"))}
                  alt={employee.fullName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-500/20 text-orange-500 font-bold text-5xl italic">
                  {employee.fullName?.charAt(0)}
                </div>
              )}
            </div>
            <div
              className={cn(
                "absolute -bottom-2 right-4 z-20 px-4 py-1.5 rounded-full border-4 border-gray-900 text-[10px] font-bold text-white shadow-xl uppercase tracking-tighter",
                employee.userStatus === "ACTIVE"
                  ? "bg-emerald-500"
                  : "bg-rose-500",
              )}
            >
              {employee.userStatus === "ACTIVE" ? "Hoạt động" : "Tạm khóa"}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4 pt-2 relative z-10">
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {roles.map((role, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg",
                    getRoleStyle(role),
                  )}
                >
                  {role}
                </span>
              ))}
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter uppercase italic leading-none">
                {employee.fullName}
              </h3>
              <p className="text-orange-400 font-bold text-sm flex items-center justify-center md:justify-start gap-2 mt-2">
                <Hash size={14} strokeWidth={3} /> UID:{" "}
                {employee.employeeId.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* --- DETAILS CONTENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 px-2">
          {/* Section 1: Tài khoản */}
          <div className="space-y-6">
            <SectionHeader icon={ShieldCheck} title="Thông tin hệ thống" />
            <div className="space-y-4">
              <FormInput
                label="Tên đăng nhập"
                value={employee.username}
                disabled
                readOnly
              />
              <FormInput
                label="Email liên kết"
                value={employee.email}
                disabled
                readOnly
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Mã nhân sự"
                  value={`EMP-${employee.employeeId.slice(0, 5).toUpperCase()}`}
                  disabled
                  readOnly
                />
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-gray-700 ml-1 uppercase tracking-widest">
                    Trạng thái tài khoản
                  </label>
                  <div
                    className={cn(
                      "h-12 flex items-center px-5 rounded-2xl border font-bold text-sm",
                      employee.userStatus === "ACTIVE"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                        : "bg-rose-50 border-rose-100 text-rose-600",
                    )}
                  >
                    {userStatusLabelMap[employee.userStatus]}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Công việc */}
          <div className="space-y-6">
            <SectionHeader icon={Briefcase} title="Vận hành chuyên môn" />
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Phòng ban"
                  value={employee.departmentName}
                  disabled
                  readOnly
                />
                <FormInput
                  label="Chức vụ"
                  value={employee.positionName}
                  disabled
                  readOnly
                />
              </div>
              <FormInput
                label="Loại hình nhân sự"
                value={workerTypeLabelMap[employee.type]}
                disabled
                readOnly
              />
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-700 ml-1 uppercase tracking-widest">
                  Tình trạng làm việc
                </label>
                <div
                  className={cn(
                    "h-12 flex items-center px-5 rounded-2xl border font-bold text-sm shadow-sm",
                    employee.status === "ACTIVE"
                      ? "bg-blue-50 border-blue-100 text-blue-600"
                      : "bg-orange-50 border-orange-100 text-orange-600",
                  )}
                >
                  {statusLabelMap[employee.status]}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Cá nhân (Full Width) */}
          <div className="md:col-span-2 p-8 rounded-[3rem] bg-gray-50/50 border border-gray-100 space-y-8">
            <SectionHeader icon={UserIcon} title="Dữ liệu định danh cá nhân" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormInput
                label="Ngày sinh"
                value={
                  employee.dateOfBirth
                    ? dayjs(employee.dateOfBirth).format("DD/MM/YYYY")
                    : "Chưa cập nhật"
                }
                disabled
                readOnly
              />
              <FormInput
                label="Giới tính"
                value={genderLabelMap[employee.gender]}
                disabled
                readOnly
              />
              <FormInput
                label="Ngày gia nhập"
                value={
                  employee.startDate
                    ? dayjs(employee.startDate).format("DD/MM/YYYY")
                    : "-"
                }
                disabled
                readOnly
              />
              <div className="md:col-span-3">
                <FormInput
                  isTextArea
                  label="Địa chỉ thường trú"
                  value={
                    employee.addressDetail || "Chưa có thông tin địa chỉ cụ thể"
                  }
                  disabled
                  readOnly
                  className="min-h-20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalModal>
  );
}

// Giữ lại Activity cho Icon nếu cần dùng
const Activity = ({ size, className }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
