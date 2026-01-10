"use client";

import authService from "@/auth/services/auth.service";
import { FormInput } from "@/components/formInput";
import { PortalModal } from "@/features/PortalModal";
import walletService from "@/services/wallet/wallet.service";
import { ResetWalletPasswordRequest } from "@/types/wallet/wallet.types";
import { getCachedUser } from "@/utils/local.storage";
import React, { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiMail,
  FiRefreshCw,
  FiShield
} from "react-icons/fi";
import { useToast } from "@/hooks/useToast";

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
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { success: toastSuccess, error: toastError } = useToast();
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
    if (visible) {
      setCurrentStep(0);
      setFormData({ otpCode: "", newPassword: "", confirmPassword: "" });
      setErrors({});
      setCountdown(0);
    }
  }, [visible]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      await walletService.forgotPassword();
      toastSuccess("Mã OTP đã được gửi đến email của bạn!");
      setCurrentStep(1);
      setCountdown(60);
    } catch (error: any) {
      toastError(error.message || "Gửi mã OTP thất bại");
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
        toastError("Không tìm thấy email người dùng");
        return;
      }
      await authService.resendOtp({
        email,
        otpType: "WALLET_PASSWORD_RESET",
      });
      toastSuccess("Mã OTP mới đã được gửi!");
      setCountdown(60);
    } catch (error: any) {
      toastError(error.message || "Gửi lại mã OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!formData.otpCode || formData.otpCode.length !== 6) newErrors.otpCode = "Mã OTP phải có 6 ký tự";
    if (!formData.newPassword || formData.newPassword.length < 6) newErrors.newPassword = "Mật khẩu tối thiểu 6 ký tự";
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Mật khẩu không khớp";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const request: ResetWalletPasswordRequest = {
        otp: formData.otpCode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };
      await walletService.resetPassword(request);
      toastSuccess("Đặt lại mật khẩu ví thành công!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toastError(error.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };


  const headerContent = (
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
          <FiShield size={18} />
        </div>
        <span>Đặt lại mật khẩu ví</span>
      </div>
    );

  const StepperUI = (
    <div className="flex items-center justify-center mb-8 relative px-4 pt-2">
      <div className="absolute top-6 left-10 right-10 h-0.5 bg-gray-100 z-0"></div>
      <div
        className="absolute top-6 left-10 h-0.5 bg-orange-500 transition-all duration-500 z-0"
        style={{ width: currentStep === 0 ? "0%" : "calc(100% - 80px)" }}
      ></div>

      <div className="flex justify-between w-full max-w-xs z-10">
        {[
          { step: 0, label: "Xác thực" },
          { step: 1, label: "Đặt lại" },
        ].map((item) => (
          <div key={item.step} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              currentStep >= item.step ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-gray-300 text-gray-600"
            }`}>
              {currentStep > item.step ? <FiCheck /> : item.step + 1}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStep >= item.step ? "text-orange-600" : "text-gray-600"}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PortalModal
      isOpen={visible}
      onClose={onClose}
      title={headerContent}
      width="max-w-md"
      className="border-t-4 border-t-orange-500"
    >
      <div className="py-2">
        {StepperUI}

        <div className="mt-4 min-h-75">
          {currentStep === 0 ? (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
                <div className="bg-white p-2.5 rounded-xl text-orange-500 shrink-0 shadow-sm">
                  <FiMail size={24} />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-orange-800 mb-1 text-base uppercase tracking-tight">Xác thực Email</p>
                  <p className="text-orange-700/80 leading-relaxed">
                    Hệ thống sẽ gửi mã xác thực (OTP) đến email liên kết để xác minh quyền sở hữu ví.
                  </p>
                </div>
              </div>

              <button
                onClick={handleRequestOtp}
                disabled={loading}
                className="group w-full py-4 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
              >
                {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                  <>Gửi mã OTP <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <FormInput
                label="Mã OTP (6 số)"
                required
                name="otpCode"
                maxLength={6}
                value={formData.otpCode}
                error={errors.otpCode}
                placeholder="• • • • • •"
                className="text-center text-xl tracking-[0.5em] font-bold"
                onChange={(e) => setFormData({ ...formData, otpCode: e.target.value })}
              />

              <FormInput
                label="Mật khẩu mới"
                required
                type="password"
                name="newPassword"
                value={formData.newPassword}
                error={errors.newPassword}
                placeholder="Tối thiểu 6 ký tự"
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />

              <FormInput
                label="Xác nhận mật khẩu"
                required
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                error={errors.confirmPassword}
                placeholder="Nhập lại mật khẩu"
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
                >
                  {loading ? <div className="h-5 w-5 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Đặt lại mật khẩu"}
                </button>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || loading}
                    className="text-xs font-bold uppercase tracking-widest text-orange-600 hover:text-orange-800 disabled:text-gray-600 transition-colors flex items-center gap-2"
                  >
                    <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại mã OTP"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </PortalModal>
  );
};