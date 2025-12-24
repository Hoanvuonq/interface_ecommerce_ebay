"use client";

import { HeaderModal } from "@/components";
import walletService from "@/services/wallet/wallet.service";
import type {
  ChangeWalletPasswordRequest,
  WalletResponse,
} from "@/types/wallet/wallet.types";
import { WalletType } from "@/types/wallet/wallet.types";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiAlertCircle, FiCheck } from "react-icons/fi";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  wallet?: WalletResponse | null;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  onSuccess,
  wallet,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isFirstTimeChange =
    wallet?.mustChangePassword === true && wallet?.type === WalletType.SHOP;
  const requiresCurrentPassword = !isFirstTimeChange;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (visible) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [visible, wallet]);

  const handleClose = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (requiresCurrentPassword && !formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      isValid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const requestData: ChangeWalletPasswordRequest = {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      if (requiresCurrentPassword) {
        requestData.currentPassword = formData.currentPassword;
      }

      await walletService.changePassword(requestData);
      
      alert("Đổi mật khẩu ví thành công!");

      onSuccess?.();
      handleClose();
    } catch (error: any) {
      alert(error.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!visible || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      ></div>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all flex flex-col overflow-hidden border border-gray-100 z-10">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-orange-400 to-orange-600"></div>
       <HeaderModal 
            isFirstTimeChange={isFirstTimeChange} 
            onClose={handleClose} 
        />

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className={`mb-6 p-4 rounded-xl border flex gap-3 ${
              isFirstTimeChange 
              ? 'bg-orange-50 border-orange-100 text-orange-800' 
              : 'bg-orange-50 border-blue-100 text-orange-800'
          }`}>
            <FiAlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isFirstTimeChange ? 'text-orange-600' : 'text-orange-600'}`} />
            <div className="text-sm leading-relaxed">
                {isFirstTimeChange ? (
                    <>
                        <span className="font-semibold block mb-1">Thiết lập lần đầu</span>
                        Ví của bạn đã được tạo tự động. Vui lòng thiết lập mật khẩu để bảo vệ tài sản và thực hiện giao dịch.
                    </>
                ) : (
                    <>
                        <span className="font-semibold block mb-1">Lưu ý bảo mật</span>
                        Mật khẩu ví dùng để xác thực khi <strong>rút tiền</strong> và <strong>thanh toán</strong>. Không chia sẻ cho người khác.
                    </>
                )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {requiresCurrentPassword && (
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Mật khẩu hiện tại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="••••••"
                    className={`w-full pl-4 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.currentPassword 
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100" 
                        : "border-gray-200 focus:border-orange-500 focus:ring-orange-100"
                    }`}
                    />
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <FiAlertCircle size={14} /> {errors.currentPassword}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Tối thiểu 6 ký tự"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.newPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-orange-500 focus:ring-orange-100"
                }`}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <FiAlertCircle size={14} /> {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu mới"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:border-orange-500 focus:ring-orange-100"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <FiAlertCircle size={14} /> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] flex justify-center items-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                    <>
                        <FiCheck className="w-5 h-5" />
                        {isFirstTimeChange ? "Hoàn tất tạo ví" : "Lưu thay đổi"}
                    </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="w-full mt-3 py-3 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render modal vào body
  return createPortal(modalContent, document.body);
};