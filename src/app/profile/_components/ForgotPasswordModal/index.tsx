"use client";

import authService from "@/auth/services/auth.service";
import { HeaderModal } from "@/components";
import walletService from "@/services/wallet/wallet.service";
import { ResetWalletPasswordRequest } from "@/types/wallet/wallet.types";
import { getCachedUser } from "@/utils/local.storage";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheck,
  FiMail,
  FiRefreshCw
} from "react-icons/fi";
import { toast } from "sonner";

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Form data
  const [formData, setFormData] = useState({
    otpCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    otpCode?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      setCurrentStep(0);
      setFormData({ otpCode: "", newPassword: "", confirmPassword: "" });
      setErrors({});
      setCountdown(0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      await walletService.forgotPassword();
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      setCurrentStep(1);
      setCountdown(60);
    } catch (error: any) {
      toast.error(error.message || "Gửi mã OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const user = getCachedUser();
      const email = user?.email;

      if (!email) {
        toast.error("Không tìm thấy email người dùng");
        return;
      }

      await authService.resendOtp({
        email,
        otpType: "WALLET_PASSWORD_RESET",
      });
      toast.success("Mã OTP mới đã được gửi!");
      setCountdown(60);
    } catch (error: any) {
      toast.error(error.message || "Gửi lại mã OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!formData.otpCode || formData.otpCode.length !== 6) {
      newErrors.otpCode = "Mã OTP phải có 6 ký tự";
      isValid = false;
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const request: ResetWalletPasswordRequest = {
        otp: formData.otpCode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      await walletService.resetPassword(request);
      toast.success("Đặt lại mật khẩu ví thành công!");
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setCountdown(0);
    setFormData({ otpCode: "", newPassword: "", confirmPassword: "" });
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

  if (!visible || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all flex flex-col overflow-hidden border border-gray-100 z-10">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-orange-400 to-orange-600"></div>
        <HeaderModal isFirstTimeChange={false}  title="Đặt lại mật khẩu ví" onClose={handleClose} />
        <div className="p-6">
          <div className="flex items-center justify-center mb-8 relative px-4">
            <div className="absolute top-4 left-10 right-10 h-0.5 bg-gray-100 -z-10"></div>
            <div
              className="absolute top-4 left-10 h-0.5 bg-orange-500 transition-all duration-500 ease-in-out -z-10"
              style={{ width: currentStep === 0 ? "0%" : "calc(100% - 80px)" }}
            ></div>

            <div className="flex justify-between w-full max-w-xs">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    currentStep >= 0
                      ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200 scale-110"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > 0 ? <FiCheck /> : "1"}
                </div>
                <span
                  className={`text-xs font-semibold tracking-wide ${
                    currentStep >= 0 ? "text-orange-600" : "text-gray-400"
                  }`}
                >
                  Xác thực
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    currentStep >= 1
                      ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200 scale-110"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-xs font-semibold tracking-wide ${
                    currentStep >= 1 ? "text-orange-600" : "text-gray-400"
                  }`}
                >
                  Đặt lại
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 min-h-70">
            {currentStep === 0 && (
              <div className="animate-fade-in-right space-y-6">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex gap-4 items-start shadow-sm">
                  <div className="bg-white p-2 rounded-full text-orange-500 shrink-0 shadow-sm">
                    <FiMail size={24} />
                  </div>
                  <div className="text-sm text-gray-700">
                    <p className="font-bold text-orange-800 mb-1 text-base">
                      Xác thực qua Email
                    </p>
                    <p className="opacity-90 leading-relaxed">
                      Hệ thống sẽ gửi mã xác thực (OTP) đến địa chỉ email liên
                      kết với tài khoản của bạn.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleRequestOtp}
                    disabled={loading}
                    className="group w-full py-3.5 px-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        Gửi mã OTP{" "}
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Để sau, quay lại
                  </button>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="animate-fade-in-right space-y-5">
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex gap-3 items-center text-sm text-green-800 shadow-sm">
                  <div className="bg-green-100 p-1.5 rounded-full shrink-0">
                    <FiCheck className="text-green-600" size={16} />
                  </div>
                  <span className="font-medium">
                    Mã OTP đã được gửi. Vui lòng kiểm tra email.
                  </span>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Mã OTP (6 số)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="otpCode"
                        maxLength={6}
                        value={formData.otpCode}
                        onChange={handleInputChange}
                        placeholder="• • • • • •"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-center text-xl tracking-[0.5em] font-bold text-gray-800 focus:outline-none focus:ring-2 focus:bg-white transition-all placeholder:tracking-normal ${
                          errors.otpCode
                            ? "border-red-300 focus:ring-red-100"
                            : "border-gray-200 focus:border-orange-500 focus:ring-orange-100"
                        }`}
                      />
                    </div>
                    {errors.otpCode && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <FiAlertCircle size={12} />
                        {errors.otpCode}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Tối thiểu 6 ký tự"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          errors.newPassword
                            ? "border-red-300 focus:ring-red-100"
                            : "border-gray-200 focus:border-orange-500 focus:ring-orange-100"
                        }`}
                      />
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <FiAlertCircle size={12} />
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Xác nhận mật khẩu
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Nhập lại mật khẩu"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          errors.confirmPassword
                            ? "border-red-300 focus:ring-red-100"
                            : "border-gray-200 focus:border-orange-500 focus:ring-orange-100"
                        }`}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <FiAlertCircle size={12} />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] flex justify-center items-center gap-2"
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Đặt lại mật khẩu"
                      )}
                    </button>

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={countdown > 0 || loading}
                        className="text-sm font-medium text-orange-600 hover:text-orange-800 disabled:text-gray-400 transition-colors flex items-center gap-2"
                      >
                        <FiRefreshCw
                          className={loading ? "animate-spin" : ""}
                        />
                        {countdown > 0
                          ? `Gửi lại mã sau ${countdown}s`
                          : "Gửi lại mã OTP"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
