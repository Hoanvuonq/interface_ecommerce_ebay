/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PortalModal } from "@/features/PortalModal";
import {
  EmployeeStatus,
  employeeStatusLabelMap,
  Gender,
  genderLabelMap,
  shopLabelMap,
  ShopStatus,
  statusLabelMap,
  UserDetail,
} from "@/types/user/user.type";
import { workerTypeLabelMap } from "@/types/employee/employee";
import { cn } from "@/utils/cn";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import dayjs from "dayjs";
import {
  Activity,
  Briefcase,
  Calendar,
  Hash,
  Loader2,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  Store,
  User as UserIcon,
  Clock,
  ExternalLink,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useGetUserDetail } from "../../_hooks/useUser";
import { SectionHeader } from "@/components";
import { ProfileHeaderCard } from "../ProfileHeaderCard";

interface UserDetailModalProps {
  open: boolean;
  userId?: string | null;
  onClose: () => void;
}

const employeeRoles = [
  "ADMIN",
  "LOGISTICS",
  "BUSINESS",
  "ACCOUNTANT",
  "EXECUTIVE",
  "IT",
  "SALE",
  "FINANCE",
];

const getRoleBadgeStyle = (role: string) => {
  const r = role.toUpperCase();
  if (r === "ADMIN") return "bg-rose-500 text-white shadow-rose-200";
  if (r === "SHOP") return "bg-blue-500 text-white shadow-blue-200";
  if (r === "BUYER") return "bg-emerald-500 text-white shadow-emerald-200";
  return "bg-orange-500 text-white shadow-orange-200";
};

const InfoCard = ({ label, value, icon: Icon, className = "" }: any) => (
  <div
    className={cn(
      "group p-4 rounded-3xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300",
      className,
    )}
  >
    <div className="flex items-center gap-2 mb-1.5">
      <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
        <Icon size={12} strokeWidth={2.5} />
      </div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
        {label}
      </label>
    </div>
    <div className="text-gray-800 font-bold text-sm leading-tight break-all">
      {value || <span className="text-gray-300 font-normal italic">N/A</span>}
    </div>
  </div>
);

export default function UserDetailModal({
  open,
  userId,
  onClose,
}: UserDetailModalProps) {
  const { handleGetUserDetail, loading, error } = useGetUserDetail();
  const [user, setUser] = useState<UserDetail | null>(null);

  useEffect(() => {
    if (!open || !userId) return;
    const fetchDetail = async () => {
      try {
        const data = await handleGetUserDetail(userId);
        setUser(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
  }, [open, userId]);

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-linear-to-br from-orange-400 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-200">
            <Shield size={22} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 uppercase text-lg leading-none tracking-tight">
              Chi tiết thực thể
            </span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
              Management System
            </span>
          </div>
        </div>
      }
      width="max-w-4xl"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem]">
          <div className="relative">
            <Loader2
              className="animate-spin text-orange-500"
              size={60}
              strokeWidth={1}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
            </div>
          </div>
          <p className="mt-6 text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">
            Đang giải mã dữ liệu...
          </p>
        </div>
      ) : error ? (
        <div className="m-4 p-10 bg-rose-50 border border-rose-100 rounded-[3rem] text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity size={32} />
          </div>
          <h4 className="text-rose-900 font-bold uppercase text-sm mb-2">
            Truy xuất thất bại
          </h4>
          <p className="text-rose-600/70 text-xs font-medium">{error}</p>
        </div>
      ) : user ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-4">
          {user && (
            <ProfileHeaderCard
              user={user}
              statusLabelMap={statusLabelMap}
              getRoleBadgeStyle={getRoleBadgeStyle}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm">
                <SectionHeader icon={ShieldCheck} title="Cấu hình thực thể" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard
                    label="Mã định danh (UID)"
                    value={`#${user.userId.toUpperCase()}`}
                    icon={Hash}
                  />
                  <InfoCard
                    label="Phiên bản dữ liệu"
                    value={`v${user.version}.0`}
                    icon={Activity}
                  />
                  <InfoCard
                    label="Ngày cập nhật"
                    value={dayjs(user.lastModifiedDate).format(
                      "DD/MM/YYYY HH:mm",
                    )}
                    icon={Calendar}
                  />
                  <InfoCard
                    label="Trạng thái xóa"
                    value={user.deleted ? "ĐÃ XÓA" : "HIỆN HÀNH"}
                    icon={Shield}
                    className={user.deleted ? "bg-rose-50 border-rose-100" : ""}
                  />
                </div>
              </div>

              {user.buyer && (
                <div className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm border-l-4 border-l-blue-500">
                  <SectionHeader
                    icon={UserIcon}
                    title="Thông tin người mua"
                    colorClass="text-blue-500"
                    bgClass="bg-blue-50"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InfoCard
                      label="Họ và tên"
                      value={user.buyer.fullName}
                      icon={UserIcon}
                      className="sm:col-span-2"
                    />
                    <InfoCard
                      label="Giới tính"
                      value={genderLabelMap[user.buyer.gender as Gender]}
                      icon={Activity}
                    />
                    <InfoCard
                      label="Số điện thoại"
                      value={user.buyer.phone}
                      icon={Hash}
                    />
                    <InfoCard
                      label="Ngày sinh"
                      value={
                        user.buyer.dateOfBirth
                          ? dayjs(user.buyer.dateOfBirth).format("DD/MM/YYYY")
                          : "-"
                      }
                      icon={Calendar}
                    />
                  </div>
                </div>
              )}

              {user.shop && (
                <div className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
                  <SectionHeader
                    icon={Store}
                    title="Thông tin đối tác"
                    colorClass="text-emerald-500"
                    bgClass="bg-emerald-50"
                  />
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex gap-4 items-start">
                      <InfoCard
                        label="Tên cửa hàng"
                        value={user.shop.shopName}
                        icon={Store}
                        className="flex-1"
                      />
                      <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 text-center min-w-32">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">
                          Status
                        </p>
                        <p className="text-sm font-bold text-emerald-700">
                          {shopLabelMap[user.shop.status as ShopStatus]}
                        </p>
                      </div>
                    </div>
                    <InfoCard
                      label="Mô tả kinh doanh"
                      value={user.shop.description}
                      icon={Info}
                    />
                  </div>
                </div>
              )}

              {user.employee && (
                <div className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm border-l-4 border-l-purple-500">
                  <SectionHeader
                    icon={Briefcase}
                    title="Hồ sơ nhân sự"
                    colorClass="text-purple-500"
                    bgClass="bg-purple-50"
                  />
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoCard
                      label="Phòng ban"
                      value={user.employee.departmentName}
                      icon={Briefcase}
                    />
                    <InfoCard
                      label="Vị trí"
                      value={user.employee.positionName}
                      icon={Shield}
                    />
                    <InfoCard
                      label="Loại nhân viên"
                      value={
                        workerTypeLabelMap[
                          user.employee.type as keyof typeof workerTypeLabelMap
                        ] ||
                        user.employee.type ||
                        "N/A"
                      }
                      icon={Activity}
                    />
                    <InfoCard
                      label="Ngày vào làm"
                      value={dayjs(user.employee.startDate).format(
                        "DD/MM/YYYY",
                      )}
                      icon={Calendar}
                    />
                    <InfoCard
                      label="Trạng thái"
                      value={
                        employeeStatusLabelMap[
                          user.employee.status as EmployeeStatus
                        ]
                      }
                      icon={Info}
                      className="col-span-2 lg:col-span-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* --- COLUMN 2: SECURITY & PERMISSIONS --- */}
            <div className="space-y-8">
              {/* Penalty Section */}
              <div
                className={cn(
                  "p-6 rounded-[2.5rem] border transition-all duration-500",
                  user.lockedAt
                    ? "bg-rose-50 border-rose-200 shadow-lg shadow-rose-500/10"
                    : "bg-gray-50 border-gray-100 opacity-60",
                )}
              >
                <SectionHeader
                  icon={Lock}
                  title="Lịch sử quản chế"
                  colorClass="text-rose-500"
                  bgClass="bg-rose-100"
                />
                {user.lockedAt ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-2xl border border-rose-100">
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">
                        Lý do khóa
                      </p>
                      <p className="text-rose-700 font-bold text-sm italic leading-relaxed">
                        "{user.reason || "Vi phạm chính sách vận hành hệ thống"}
                        "
                      </p>
                    </div>
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        Thời gian khóa
                      </span>
                      <span className="text-xs font-bold text-rose-600">
                        {dayjs(user.lockedAt).format("HH:mm - DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm text-emerald-500">
                      <Shield size={24} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                      Tài khoản trong sạch
                    </p>
                  </div>
                )}
              </div>

              {/* Permissions Section */}
              <div className="p-6 rounded-[2.5rem] bg-gray-900 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <ShieldCheck size={120} className="text-white" />
                </div>
                <div className="relative z-10">
                  <SectionHeader
                    icon={Shield}
                    title="Đặc quyền"
                    colorClass="text-orange-500"
                    bgClass="bg-orange-500/20"
                  />
                  <div className="flex flex-wrap gap-2">
                    {user.rolePermissions?.map((perm: any) => (
                      <span
                        key={perm.permissionId}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-gray-400 uppercase hover:bg-white/10 transition-colors"
                      >
                        {perm.permissionName}
                      </span>
                    ))}
                    {user.userPermissions?.map((perm: any) => (
                      <span
                        key={perm.permissionId}
                        className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-xl text-[9px] font-bold text-orange-400 uppercase"
                      >
                        {perm.permissionName} (Custom)
                      </span>
                    ))}
                    {!user.rolePermissions?.length &&
                      !user.userPermissions?.length && (
                        <p className="text-gray-500 text-[10px] font-bold italic py-4">
                          Chưa được gán quyền...
                        </p>
                      )}
                  </div>
                  <button className="w-full mt-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <ExternalLink size={12} /> Quản lý phân quyền
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PortalModal>
  );
}
