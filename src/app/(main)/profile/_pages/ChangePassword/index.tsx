"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChangePassword } from "@/auth/_hooks/useAuth";
import { ChangePasswordRequest } from "@/auth/_types/auth";
import { getUserId } from "@/utils/jwt";
import { InputField, ButtonField } from "@/components";
import { FaCheckCircle, FaRandom, FaCopy } from "react-icons/fa";
import { MdVpnKey } from "react-icons/md";
import {
  generateSecurePassword,
  copyToClipboard,
} from "@/utils/passwordGenerator";
import { toast } from "sonner";

export default function ChangePasswordFormCompact() {
  const { handleChangePassword, loading } = useChangePassword();
  const userId: string = getUserId() || "";
  const oldPasswordRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ChangePasswordRequest>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    oldPasswordRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Mật khẩu phải chứa ít nhất 6 ký tự";
      } else if (!passwordPattern.test(formData.newPassword)) {
        newErrors.newPassword = "Mật khẩu phải gồm chữ hoa, thường và số";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword({ length: 12 });
    setFormData((prev) => ({
      ...prev,
      newPassword: newPassword,
      confirmPassword: newPassword,
    }));
    setErrors((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));

    toast.success("Đã tạo mật khẩu mạnh!", {
      description: "Hãy lưu lại mật khẩu này nhé.",
    });
  };

  const handleCopyPassword = async () => {
    if (formData.newPassword) {
      const success = await copyToClipboard(formData.newPassword);
      if (success) {
        toast.success("Đã sao chép!", {
          description: "Mật khẩu đã được lưu vào clipboard.",
        });
      } else {
        toast.error("Lỗi sao chép!");
      }
    } else {
      toast.warning("Chưa có mật khẩu", {
        description: "Vui lòng nhập hoặc tạo mật khẩu mới trước.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await handleChangePassword(userId, formData);
      if (res) {
        toast.success("Thành công", {
          description: "Đổi mật khẩu thành công!",
        });
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error("Thất bại", { description: "Đổi mật khẩu thất bại!" });
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Đổi mật khẩu thất bại!";
      toast.error("Lỗi", { description: errorMessage });
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl animate-fade-in">
      <div className="mb-8 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          Đổi mật khẩu
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-600">
          Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản của bạn an toàn
          hơn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Old Password */}
        <div>
          <InputField
            label="Mật khẩu hiện tại"
            name="oldPassword"
            type="password"
            placeholder="Nhập mật khẩu hiện tại..."
            value={formData.oldPassword}
            onChange={handleChange}
            errorMessage={errors.oldPassword}
            ref={oldPasswordRef}
            inputClassName="bg-white border-gray-200 focus:border-gray-500 focus:ring-orange-200"
          />
        </div>

        <div className="p-5 bg-linear-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-900/30 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg shadow-inner">
                <MdVpnKey className="text-orange-600 dark:text-orange-400 text-xl" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">
                  Mật khẩu mới
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-600">
                  Thiết lập mật khẩu mạnh
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-xs font-semibold rounded-lg transition-all shadow-sm active:scale-95"
                title="Tạo mật khẩu ngẫu nhiên an toàn"
              >
                <FaRandom /> Tạo tự động
              </button>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-xs font-semibold rounded-lg transition-all shadow-sm active:scale-95 hover:text-gray-900"
                title="Sao chép mật khẩu mới"
              >
                <FaCopy /> Sao chép
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <InputField
              label="Mật khẩu mới"
              name="newPassword"
              placeholder="Tạo mật khẩu an toàn..."
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              errorMessage={errors.newPassword}
              inputClassName="bg-white dark:bg-gray-800 border-gray-200 focus:border-gray-500 focus:ring-orange-200"
            />

            <InputField
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu..."
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              errorMessage={errors.confirmPassword}
              inputClassName="bg-white dark:bg-gray-800 border-gray-200 focus:border-gray-500 focus:ring-orange-200"
            />
          </div>
        </div>

        <div className="pt-2">
          <ButtonField
            htmlType="submit"
            type="login"
            loading={loading}
            disabled={loading}
            className="w-45  rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.99] transition-all bg-orange-600 hover:bg-orange-700 border-none text-white"
          >
            <span className="flex items-center gap-2">
               <FaCheckCircle />
              <span>đổi mật khẩu</span>
            </span>
          </ButtonField>
        </div>
      </form>
    </div>
  );
}
