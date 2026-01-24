/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { statusLabelMap, User, UserStatus } from "@/types/user/user.type";
import dayjs from "dayjs";
import { ButtonField } from "@/components";
import { useEffect, useState } from "react";
import { useGetAllRoles, useUpdateUser } from "../../_hooks/useUser";
import {
  Loader2,
  UserCircle2,
  ShieldCheck,
  Calendar,
  Hash,
  Mail,
  User as UserIcon,
  Settings2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import _ from "lodash";
import { PortalModal } from "@/features/PortalModal";
import { SelectComponent, FormInput } from "@/components";
import { Button } from "@/components/button/button";

interface UserUpdateFormProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function UserUpdateForm({
  open,
  user,
  onClose,
  onUpdated,
}: UserUpdateFormProps) {
  const { handleUpdateUser, loading, error: updateError } = useUpdateUser();
  const { handleGetAllRoles, error: rolesError } = useGetAllRoles();

  const [formData, setFormData] = useState({
    status: undefined as UserStatus | undefined,
    role: "",
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ status?: string; role?: string }>({});

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await handleGetAllRoles();
        if (res?.data?.roles) setRoles(res.data.roles);
      } catch (err: any) {
        console.error(rolesError || err?.message);
      }
    };
    if (open) fetchRoles();
  }, [open]);

  useEffect(() => {
    if (open && user) {
      setFormData({
        status: user.status,
        role: user.roleName || "",
      });
      setErrors({});
    }
  }, [open, user]);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.status) newErrors.status = "Vui lòng chọn trạng thái!";
    if (!formData.role) newErrors.role = "Vui lòng chọn vai trò!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    try {
      const payload = _.pickBy(
        {
          status: formData.status,
          role: formData.role,
        },
        _.identity,
      );

      const res = await handleUpdateUser(user.userId, payload);
      if (res) {
        onUpdated();
        onClose();
      }
    } catch (err: any) {
      console.error(updateError || err?.message);
    }
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl shadow-sm shadow-orange-100">
            <Settings2 size={22} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-800 uppercase text-lg tracking-tight">
            Cấu hình quyền hạn
          </span>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="flex justify-end gap-3 w-full border-t border-gray-100 pt-5 mt-2">
          <Button
            variant="edit"
            onClick={onClose}
            className="rounded-xl px-6 border-gray-200"
          >
            Hủy bỏ
          </Button>
          <ButtonField
            form="update-user-form"
            htmlType="submit"
            type="login"
            disabled={loading || !user}
            className="flex w-44 items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Lưu thay đổi"
            )}
          </ButtonField>
        </div>
      }
    >
      <div className="min-h-60 px-1">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
              Đang đồng bộ dữ liệu...
            </p>
          </div>
        ) : (
          <form
            id="update-user-form"
            onSubmit={handleOk}
            className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-2"
          >
            {/* Section: Thông tin định danh */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                <ShieldCheck size={18} className="text-orange-500" />
                <h3 className="font-bold text-gray-800 uppercase text-[12px] tracking-wider">
                  Thông tin tài khoản
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="Tên đăng nhập"
                  value={user.username}
                  disabled
                  className="bg-gray-50/80 border-gray-100 font-bold text-gray-500"
                />
                <FormInput
                  label="Email liên kết"
                  value={user.email}
                  disabled
                  className="bg-gray-50/80 border-gray-100 font-bold text-gray-500"
                />
                <FormInput
                  label="Ngày khởi tạo"
                  value={
                    user.createdDate
                      ? dayjs(user.createdDate).format("DD/MM/YYYY")
                      : "-"
                  }
                  disabled
                  className="bg-gray-50/80 border-gray-100 font-bold text-gray-500"
                />
                <FormInput
                  label="Mã định danh (UID)"
                  value={`#${user.userId.slice(-12).toUpperCase()}`}
                  disabled
                  className="bg-gray-50/80 border-gray-100 font-mono text-[13px] font-bold text-gray-400"
                />
              </div>
            </div>

            {/* Section: Cập nhật */}
            <div className="p-6 rounded-[2.5rem] bg-orange-50/40 border border-orange-100/50 space-y-6 shadow-sm">
              <div className="flex justify-center -mt-9 mb-2">
                <span className="bg-orange-500 text-white px-5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-md shadow-orange-200">
                  Cấu hình mới
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Trạng thái */}
                <div className="space-y-2.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 ml-1">
                    Trạng thái hiện tại{" "}
                    <span className="text-orange-500 ml-1">*</span>
                  </label>
                  <SelectComponent
                    options={Object.entries(statusLabelMap).map(
                      ([key, label]) => ({
                        label: label,
                        value: key,
                      }),
                    )}
                    value={formData.status ? [formData.status] : []}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        status: (val && val[0]) as UserStatus,
                      })
                    }
                    placeholder="Chọn trạng thái..."
                    className={cn(
                      "rounded-2xl border-gray-200 h-12 shadow-sm",
                      errors.status && "border-red-500 focus:ring-red-100",
                    )}
                  />
                  {errors.status && (
                    <span className="text-[10px] font-bold text-red-500 ml-1 animate-pulse uppercase tracking-tight">
                      {errors.status}
                    </span>
                  )}
                </div>

                {/* Vai trò */}
                <div className="space-y-2.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 ml-1">
                    Vai trò hệ thống{" "}
                    <span className="text-orange-500 ml-1">*</span>
                  </label>
                  <SelectComponent
                    options={roles.map((r) => ({
                      label: r.roleName,
                      value: r.roleName,
                    }))}
                    value={formData.role ? [formData.role] : []}
                    onChange={(val) =>
                      setFormData({ ...formData, role: val[0] || "" })
                    }
                    placeholder="Chọn vai trò..."
                    className={cn(
                      "rounded-2xl border-gray-200 h-12 shadow-sm",
                      errors.role && "border-red-500 focus:ring-red-100",
                    )}
                  />
                  {errors.role && (
                    <span className="text-[10px] font-bold text-red-500 ml-1 animate-pulse uppercase tracking-tight">
                      {errors.role}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-2xl border border-orange-100/50">
                <div className="mt-1">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                </div>
                <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-wide">
                  Hệ thống sẽ cập nhật quyền hạn ngay khi bạn nhấn lưu. Người
                  dùng có thể cần tải lại trang để thấy các thay đổi.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </PortalModal>
  );
}
