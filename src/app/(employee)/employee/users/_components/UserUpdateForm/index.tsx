/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  statusLabelMap,
  User,
  UserStatus,
} from "@/types/user/user.type";
import dayjs from "dayjs";
import { InputField } from "@/components";
import { useEffect, useState } from "react";
import { useGetAllRoles, useUpdateUser } from "../../_hooks/useUser";
import {
  Loader2,
  UserCircle2,
  ShieldCheck,
  Calendar,
  Hash,
} from "lucide-react";
import { cn } from "@/utils/cn";
import _ from "lodash";
import { PortalModal } from "@/features/PortalModal";
import { SelectComponent } from "@/components/SelectComponent";

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

  // Fetch roles metadata
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

  // Sync user data to form
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
        _.identity
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
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
            <UserCircle2 size={22} strokeWidth={2.5} />
          </div>
          <span className="font-black tracking-tight text-slate-800 uppercase text-lg">
            Cập nhật quyền hạn
          </span>
        </div>
      }
      width="max-w-2xl"
      footer={
        <div className="flex justify-end gap-3 w-full border-t border-slate-100 pt-4 mt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="update-user-form"
            disabled={loading || !user}
            className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center group active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : null}
            Xác nhận thay đổi
          </button>
        </div>
      }
    >
      <div className="min-h-[200px]">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest animate-pulse">
              Đang nạp dữ liệu...
            </p>
          </div>
        ) : (
          <form
            id="update-user-form"
            onSubmit={handleOk}
            className="space-y-8 animate-in fade-in duration-500 pb-4"
          >
            {/* --- Section 1: Account Identification --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <ShieldCheck size={16} className="text-orange-500" />
                <h3 className="font-black text-slate-800 tracking-tight uppercase text-[11px]">
                  Thông tin định danh
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Username"
                  name="username"
                  value={user.username}
                  disabled
                  itemClassName="mb-0"
                  inputClassName="bg-slate-50/50 border-slate-100 font-bold text-slate-500 cursor-not-allowed"
                />
                <InputField
                  label="Địa chỉ Email"
                  name="email"
                  value={user.email}
                  disabled
                  itemClassName="mb-0"
                  inputClassName="bg-slate-50/50 border-slate-100 font-bold text-slate-500 cursor-not-allowed"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    Ngày tham gia
                  </label>
                  <div className="px-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <Calendar size={14} className="text-slate-400" />
                    {user.createdDate
                      ? dayjs(user.createdDate).format("DD/MM/YYYY")
                      : "-"}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    ID Tài khoản
                  </label>
                  <div className="px-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-slate-500 font-mono text-xs font-bold flex items-center gap-2">
                    <Hash size={12} className="text-slate-300" />
                    #{user.userId.slice(-12).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Divider with Label --- */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
                  Cấu hình quyền hạn mới
                </span>
              </div>
            </div>

            {/* --- Section 2: Interactive Update Fields --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-[2rem] bg-orange-50/30 border border-orange-100/50">
              {/* Select Trạng thái mới */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-700 ml-1">
                  Trạng thái tài khoản <span className="text-orange-500">*</span>
                </label>
                <SelectComponent
                  options={Object.entries(statusLabelMap).map(
                    ([key, label]) => ({
                      label: label,
                      value: key,
                    })
                  )}
                  value={formData.status ? [formData.status] : []}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      status: (val && val[0]) as UserStatus,
                    })
                  }
                  placeholder="Chọn trạng thái..."
                  className={cn(errors.status && "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]")}
                />
                {errors.status && (
                  <p className="mt-1.5 px-2 text-[10px] font-black text-red-500 uppercase tracking-tight">
                    {errors.status}
                  </p>
                )}
              </div>

              {/* Select Vai trò mới */}
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-widest text-slate-700 ml-1">
                  Vai trò hệ thống <span className="text-orange-500">*</span>
                </label>
                <SelectComponent
                  options={roles.map((r) => ({
                    label: r.roleName,
                    value: r.roleName,
                  }))}
                  value={formData.role ? [formData.role] : []}
                  onChange={(val) => setFormData({ ...formData, role: val[0] || "" })}
                  placeholder="Chọn vai trò..."
                  className={cn(errors.role && "border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]")}
                />
                {errors.role && (
                  <p className="mt-1.5 px-2 text-[10px] font-black text-red-500 uppercase tracking-tight">
                    {errors.role}
                  </p>
                )}
              </div>
            </div>

            {/* --- Section 3: Professional Hint Box --- */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 shadow-sm shadow-slate-100/50">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                Lưu ý quan trọng: Thay đổi quyền hạn hoặc trạng thái sẽ có hiệu lực ngay lập tức. 
                Người dùng có thể cần đăng nhập lại hoặc làm mới trang để đồng bộ phiên làm việc mới nhất.
              </p>
            </div>
          </form>
        )}
      </div>
    </PortalModal>
  );
}