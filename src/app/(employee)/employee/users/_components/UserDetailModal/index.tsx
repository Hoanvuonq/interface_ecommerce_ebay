/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  WorkerType as EmployeeWorkerType,
  workerTypeLabelMap,
} from "@/types/employee/employee";
import {
  Gender,
  ShopStatus,
  UserDetail,
  EmployeeStatus,
  employeeStatusLabelMap,
  genderLabelMap,
  shopLabelMap,
  statusLabelMap,
} from "@/types/user/user.type";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useGetUserDetail } from "../../_hooks/useUser";
import { PortalModal } from "@/features/PortalModal";
import {
  Loader2,
  Shield,
  User as UserIcon,
  Store,
  Briefcase,
  Lock,
  Mail,
  Calendar,
  Hash,
  Activity,
} from "lucide-react";
import { cn } from "@/utils/cn";

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

const getUserRoles = (user: UserDetail | null): string[] => {
  if (!user) return [];
  if (user.roles && user.roles.length > 0)
    return user.roles.map((r) => r.toUpperCase());
  if (user.roleName) return [user.roleName.toUpperCase()];
  return [];
};

const getRoleColor = (role: string): string => {
  const roleUpper = role.toUpperCase();
  if (roleUpper === "ADMIN") return "bg-rose-100 text-rose-600 border-rose-200";
  if (roleUpper === "SHOP") return "bg-blue-100 text-blue-600 border-blue-200";
  if (roleUpper === "BUYER")
    return "bg-emerald-100 text-emerald-600 border-emerald-200";
  return "bg-orange-100 text-orange-600 border-gray-200";
};

const DetailField = ({
  label,
  value,
  icon: Icon,
  className = "",
}: {
  label: string;
  value: any;
  icon?: any;
  className?: string;
}) => (
  <div
    className={cn(
      "p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300",
      className
    )}
  >
    <div className="flex items-center gap-2 mb-1.5 text-gray-600">
      {Icon && <Icon size={12} strokeWidth={2.5} className="text-orange-400" />}
      <label className="text-[10px] font-semibold uppercase tracking-widest leading-none">
        {label}
      </label>
    </div>
    <div className="text-gray-700 font-bold text-sm truncate">
      {value || (
        <span className="opacity-30 font-normal italic text-xs">Trống</span>
      )}
    </div>
  </div>
);

const userHasRole = (user: UserDetail | null, roleName: string): boolean => {
  const roles = getUserRoles(user);
  return roles.includes(roleName.toUpperCase());
};
const userHasAnyRole = (
  user: UserDetail | null,
  roleNames: string[]
): boolean => {
  const userRoles = getUserRoles(user);
  return userRoles.some((userRole) =>
    roleNames.some((roleName) => roleName.toUpperCase() === userRole)
  );
}

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
          <div className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-200">
            <UserIcon size={20} strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight text-xl text-gray-800 uppercase">
            Hồ sơ người dùng
          </span>
        </div>
      }
      width="max-w-4xl"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2
            className="animate-spin text-orange-500 mb-4"
            size={48}
            strokeWidth={1.5}
          />
          <p className="text-gray-600 font-semibold text-xs uppercase tracking-widest animate-pulse">
            Đang nạp dữ liệu...
          </p>
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-50 border border-rose-100 rounded-4xl text-rose-600 text-center">
          <p className="font-semibold uppercase text-xs tracking-widest mb-2">
            Đã xảy ra lỗi
          </p>
          <p className="font-bold text-sm">{error}</p>
        </div>
      ) : user ? (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-6">
          {/* Section 1: Top Profile Card */}
          <div className="relative overflow-hidden p-6 md:p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <UserIcon size={180} />
            </div>

            <div className="relative group shrink-0">
              <img
                src={
                  user.image
                    ? toPublicUrl(toSizedVariant(user.image, "_orig"))
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                }
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-[3rem] border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500"
                alt="Avatar"
              />
              <div
                className={cn(
                  "absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-4 border-white text-[10px] font-semibold text-white shadow-lg uppercase tracking-wider",
                  user.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                )}
              >
                {statusLabelMap[user.status]}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4 pt-2">
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {getUserRoles(user).map((role, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "px-4 py-1 rounded-xl text-[10px] font-semibold border uppercase tracking-widest shadow-sm",
                      getRoleColor(role)
                    )}
                  >
                    {role}
                  </span>
                ))}
              </div>
              <div>
                <h2 className="text-4xl font-semibold text-gray-900 tracking-tighter mb-1 uppercase italic">
                  {user.username}
                </h2>
                <p className="text-gray-600 font-bold text-sm flex items-center justify-center md:justify-start gap-2">
                  <Mail size={14} className="text-orange-500" /> {user.email}
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-6 border-t border-gray-200">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
                    ID Định danh
                  </p>
                  <p className="text-gray-700 font-semibold text-xs">
                    #{user.userId.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
                    Ngày tham gia
                  </p>
                  <p className="text-gray-700 font-semibold text-xs">
                    {dayjs(user.createdDate).format("DD MMM, YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Info Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* System Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-4">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                <h3 className="font-semibold text-gray-800 tracking-tight uppercase text-xs">
                  Cấu hình bảo mật
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-4xl border border-gray-100">
                <DetailField
                  label="Đã xóa"
                  value={user.deleted || user.isDeleted ? "Có" : "Không"}
                  icon={Activity}
                />
                <DetailField
                  label="Lần cuối sửa"
                  value={
                    user.lastModifiedDate
                      ? dayjs(user.lastModifiedDate).format("DD/MM/YYYY")
                      : "-"
                  }
                  icon={Calendar}
                />
                <DetailField
                  label="Phiên bản"
                  value={user.version}
                  icon={Hash}
                />
                <DetailField
                  label="Lock Status"
                  value={user.lockedAt ? "Bị khóa" : "Bình thường"}
                  icon={Shield}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-4">
                <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                <h3 className="font-semibold tracking-tight uppercase text-xs text-rose-600">
                  Lịch sử vi phạm
                </h3>
              </div>
              <div
                className={cn(
                  "p-5 h-full rounded-4xl border transition-all duration-300",
                  user.lockedAt
                    ? "bg-rose-50 border-rose-100"
                    : "bg-gray-50 border-gray-100 opacity-60"
                )}
              >
                {user.lockedAt ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold text-rose-400 uppercase tracking-widest mb-1">
                        Lý do khóa tài khoản
                      </p>
                      <p className="text-rose-700 text-sm font-bold italic leading-relaxed">
                        "
                        {user.reason ||
                          "Vi phạm nghiêm trọng chính sách cộng đồng"}
                        "
                      </p>
                    </div>
                    <div className="pt-2 border-t border-rose-200 flex items-center justify-between text-rose-500 font-bold text-[10px]">
                      <span>KHÓA LÚC:</span>
                      <span>
                        {dayjs(user.lockedAt).format("HH:mm - DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
                    <Shield size={24} strokeWidth={1} />
                    <p className="text-[10px] font-semibold uppercase tracking-widest">
                      Tài khoản trong sạch
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {(userHasRole(user, "BUYER") || user.buyer) && (
              <div className="p-1 rounded-[2.5rem] bg-linear-to-r from-blue-500 to-indigo-600 shadow-xl shadow-blue-200/50">
                <div className="bg-white rounded-[2.4rem] p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <UserIcon size={18} />
                      </div>
                      <h3 className="font-semibold text-gray-800 tracking-tight uppercase text-xs">
                        Thông tin Người mua hàng
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
                      Type: Buyer
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailField
                      label="Họ và tên"
                      value={user.buyer?.fullName || (user as any).fullName}
                      className="sm:col-span-2 md:col-span-1"
                    />
                    <DetailField
                      label="Điện thoại"
                      value={user.buyer?.phone || (user as any).phone}
                    />
                    <DetailField
                      label="Giới tính"
                      value={
                        genderLabelMap[
                          (user.buyer?.gender || (user as any).gender) as Gender
                        ]
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Shop Block */}
            {(userHasRole(user, "SHOP") || user.shop) && (
              <div className="p-1 rounded-[2.5rem] bg-linear-to-r from-emerald-500 to-teal-600 shadow-xl shadow-emerald-200/50">
                <div className="bg-white rounded-[2.4rem] p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Store size={18} />
                      </div>
                      <h3 className="font-semibold text-gray-800 tracking-tight uppercase text-xs">
                        Thông tin Shop đối tác
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">
                      Type: Merchant
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailField
                      label="Tên cửa hàng"
                      value={user.shop?.shopName || (user as any).shopName}
                    />
                    <DetailField
                      label="Trạng thái"
                      value={
                        shopLabelMap[
                          (user.shop?.status ||
                            (user as any).shopStatus) as ShopStatus
                        ]
                      }
                    />
                    <DetailField
                      label="Mô tả cửa hàng"
                      value={
                        user.shop?.description || (user as any).description
                      }
                      className="sm:col-span-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Employee Block */}
            {(userHasAnyRole(user, employeeRoles) || user.employee) && (
              <div className="p-1 rounded-[2.5rem] bg-linear-to-r from-purple-500 to-violet-600 shadow-xl shadow-purple-200/50">
                <div className="bg-white rounded-[2.4rem] p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                        <Briefcase size={18} />
                      </div>
                      <h3 className="font-semibold text-gray-800 tracking-tight uppercase text-xs">
                        Thông tin Nhân sự
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold bg-purple-100 text-purple-600 px-3 py-1 rounded-full uppercase tracking-widest">
                      Type: Staff
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DetailField
                      label="Phòng ban"
                      value={
                        user.employee?.departmentName ||
                        (user as any).departmentName
                      }
                    />
                    <DetailField
                      label="Vị trí công tác"
                      value={
                        user.employee?.positionName ||
                        (user as any).positionName
                      }
                    />
                    <DetailField
                      label="Loại hợp đồng"
                      value={
                        workerTypeLabelMap[
                          (user.employee?.type ||
                            (user as any).type) as EmployeeWorkerType
                        ]
                      }
                    />
                    <DetailField
                      label="Ngày vào làm"
                      value={dayjs(
                        user.employee?.startDate || (user as any).startDate
                      ).format("DD/MM/YYYY")}
                      icon={Calendar}
                    />
                    <DetailField
                      label="Tình trạng"
                      value={
                        employeeStatusLabelMap[
                          (user.employee?.status ||
                            (user as any).employeeStatus) as EmployeeStatus
                        ]
                      }
                      className="sm:col-span-2 lg:col-span-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Permissions Tag Cloud */}
          <div className="relative p-8 rounded-[2.5rem] bg-gray-900 overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 p-12 opacity-10 rotate-12 text-white">
              <Lock size={160} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                <h3 className="font-semibold  uppercase text-xs text-white">
                  Quyền hạn hệ thống
                </h3>
                <div className="flex-1 border-b border-white/10 ml-2" />
              </div>

              <div className="flex flex-wrap gap-2">
                {user.rolePermissions?.map((perm: any) => (
                  <span
                    key={perm.permissionId}
                    className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-gray-500 transition-all hover:scale-105 cursor-default uppercase"
                  >
                    {perm.permissionName}
                  </span>
                ))}
                {user.userPermissions?.map((perm: any) => (
                  <span
                    key={perm.permissionId}
                    className="px-4 py-1.5 bg-orange-500/10 text-orange-400 border border-gray-500/20 rounded-xl text-[10px] font-semibold transition-all hover:scale-105 cursor-default uppercase tracking-wider"
                  >
                    {perm.permissionName} (Custom)
                  </span>
                ))}
                {!user.rolePermissions?.length &&
                  !user.userPermissions?.length && (
                    <p className="text-gray-500 font-bold text-xs italic">
                      Tài khoản này chưa được cấp quyền hạn cụ thể.
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-gray-500 gap-4">
          <Activity size={48} strokeWidth={1} />
          <p className="font-semibold uppercase tracking-[0.3em] text-[10px]">
            Thực thể không tồn tại
          </p>
        </div>
      )}
    </PortalModal>
  );
}
