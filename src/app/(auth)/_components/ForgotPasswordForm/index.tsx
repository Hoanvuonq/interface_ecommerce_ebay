/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useForgotPassword,
  useResetPassword,
  useVerifyPassword,
} from "@/auth/_hooks/useAuth";
import authService from "@/auth/services/auth.service";
import { ButtonField, CustomButton, Design, InputField } from "@/components";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { debouncePromise } from "@/utils/debounce";
import {
  copyToClipboard,
  generateSecurePassword,
} from "@/utils/passwordGenerator";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaCheckCircle,
  FaCopy,
  FaEnvelopeOpenText,
  FaKey,
  FaLock,
  FaRandom
} from "react-icons/fa";
import { MdEmail, MdSecurity } from "react-icons/md";
import { useVerifyForm } from "../../_hooks/useVerifyForm";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { success, warning, error: toastError } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const identifierRef = useRef<HTMLInputElement>(null);
  
  const { handleForgotPassword, loading: forgotLoading } = useForgotPassword();
  const { handleVerifyPassword, loading: verifyLoading, error: verifyError } = useVerifyPassword();
  const { handleResetPassword, loading: resetLoading } = useResetPassword();

  const { 
    otp, 
    countdown, 
    inputRefs, 
    handleChange, 
    handleKeyDown, 
    handlePaste,
    resetCountdown,
    resetOtp
  } = useVerifyForm({
    email: formData.email,
    mode: "REGISTRATION",
    onSendInitialOtp: async () => {
      try {
        await handleForgotPassword({ email: formData.email });
        success("Mã xác thực mới đã được gửi.");
      } catch (err: any) {
        toastError("Lỗi gửi mã", { description: err?.message });
      }
    }
  });

  const submitting = forgotLoading || verifyLoading || resetLoading;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

  const debounceCheckEmail = debouncePromise(
    authService.checkEmailExists.bind(authService),
    500
  );

  useEffect(() => {
    if (step !== 2) {
      identifierRef.current?.focus();
    }
  }, [step]);

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword({ length: 12 });
    setFormData((prev) => ({ ...prev, password: newPassword, confirmPassword: newPassword }));
    success("Đã tạo mật khẩu mạnh tự động!");
  };

  const validateEmailExist = async (value: string) => {
    if (!value) return "Vui lòng nhập email";
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    if (!isValidEmail) return "Email không hợp lệ";
    try {
      const exists = await debounceCheckEmail(value.trim());
      if (!exists) return "Email này không tồn tại trong hệ thống";
      return null;
    } catch (err: any) {
      return err?.message || "Không thể kiểm tra email.";
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (step === 1) {
      const emailError = await validateEmailExist(formData.email);
      if (emailError) {
        setErrors({ email: emailError });
        return;
      }
      try {
        const res = await handleForgotPassword({ email: formData.email });
        if (res) {
          success("Mã OTP đã được gửi đến email của bạn.");
          resetCountdown();
          setStep(2);
        }
      } catch (err: any) {
        toastError("Lỗi", { description: err?.message });
      }
    } 
    else if (step === 2) {
      const otpCode = otp.join("");
      if (otpCode.length !== 6) {
        toastError("Lỗi", { description: "Vui lòng nhập đủ 6 chữ số mã OTP" });
        return;
      }
      if (!passwordPattern.test(formData.password)) {
        setErrors({ 
          password: "Mật khẩu phải bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số" 
        });
        return;
      }
      
      try {
        const res = await handleVerifyPassword({ email: formData.email, otpCode });
        if (res) {
          success("Xác thực thành công!");
          setStep(3);
        } else {
          toastError("Xác thực thất bại", { 
            description: verifyError || "Mã OTP không chính xác hoặc đã hết hạn." 
          });
          resetOtp(); 
        }
      } catch (err: any) {
        toastError("Lỗi", { description: err?.message || "Mã OTP không hợp lệ" });
        resetOtp();
      }
    } 
    else {
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: "Mật khẩu xác nhận không khớp" });
        return;
      }
      try {
        const res = await handleResetPassword({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        if (res) {
          success("Đặt lại mật khẩu thành công!");
          router.push("/login");
        }
      } catch (err: any) {
        toastError("Lỗi", { description: err?.message });
      }
    }
  };

  const getStepConfig = () => {
    switch (step) {
      case 1:
        return { icon: FaKey, gradient: "from-orange-400 to-orange-600", title: "Quên mật khẩu?", desc: "Nhập email đã đăng ký để nhận mã xác thực" };
      case 2:
        return { icon: FaEnvelopeOpenText, gradient: "from-orange-500 to-orange-700", title: "Xác minh OTP", desc: "Nhập mã OTP vừa được gửi đến email của bạn" };
      case 3:
        return { icon: FaLock, gradient: "from-green-500 to-green-600", title: "Đặt lại mật khẩu", desc: "Tạo mật khẩu mới an toàn cho tài khoản" };
      default:
        return { icon: FaKey, gradient: "from-orange-400 to-orange-600", title: "", desc: "" };
    }
  };

  const config = getStepConfig();
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500">
      <Design />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Progress Steps */}
          <div className="mb-10 flex justify-center items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 
                  ${s === step ? `bg-orange-500 text-white border-transparent shadow-lg scale-110` : 
                    s < step ? "bg-orange-500 text-white border-transparent" : "bg-white dark:bg-slate-700 text-gray-400 border-gray-200 dark:border-slate-600"}`}>
                  {s < step ? <FaCheckCircle size={18} /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 mx-1 ${s < step ? "bg-orange-500" : "bg-gray-200 dark:bg-slate-600"}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-4xl shadow-2xl border border-white/20 p-8 sm:p-10 transition-all">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className={cn("w-20 h-20 bg-linear-to-br rounded-3xl rotate-12 flex items-center justify-center shadow-xl shadow-orange-500/20", config.gradient)}>
                  <IconComponent className="text-white text-3xl -rotate-12" />
                </div>
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">{config.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{config.desc}</p>
            </div>

            <form onSubmit={handleFinish} className="space-y-5">
              {step === 1 && (
                <div className="space-y-4">
                  <InputField
                    label="Địa chỉ Email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    errorMessage={errors.email}
                    ref={identifierRef}
                  />
                  <div className="flex gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/50">
                    <MdEmail className="text-orange-500 text-xl shrink-0" />
                    <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed font-medium">
                      Mã OTP sẽ được gửi vào email của bạn để xác thực quyền sở hữu.
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center bg-orange-50 dark:bg-orange-900/10 py-3 rounded-2xl border border-orange-100 dark:border-orange-800/50">
                    <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold block mb-1 uppercase tracking-widest">Email nhận mã</span>
                    <span className="text-gray-800 dark:text-white font-bold">{formData.email}</span>
                  </div>
                  
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={data}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        onFocus={(e) => e.target.select()}
                        className={cn(
                          "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none",
                          "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:-translate-y-1",
                          "bg-gray-50 border-gray-200 text-gray-800",
                          "dark:bg-slate-700/50 dark:border-slate-600 dark:text-gray-100",
                          data ? "border-orange-500 bg-white dark:bg-slate-700 shadow-sm" : ""
                        )}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-gray-500">Gửi lại mã sau <span className="font-bold text-orange-600">{countdown}s</span></p>
                    ) : (
                      <button 
                        type="button"
                        className="text-sm font-bold text-orange-600 hover:text-orange-700 underline underline-offset-4"
                        onClick={async () => {
                          await handleForgotPassword({ email: formData.email });
                          resetCountdown();
                          resetOtp();
                          success("Đã gửi lại mã OTP mới");
                        }}
                      >
                        Gửi lại mã OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <InputField
                    label="Mật khẩu mới"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    errorMessage={errors.password}
                    ref={identifierRef}
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={handleGeneratePassword} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-200 transition-all uppercase">
                      <FaRandom /> Tạo tự động
                    </button>
                    <button type="button" onClick={() => copyToClipboard(formData.password).then(() => success("Đã sao chép!"))} className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-200 transition-all uppercase">
                      <FaCopy /> Sao chép
                    </button>
                  </div>
                  <InputField
                    label="Xác nhận mật khẩu"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    errorMessage={errors.confirmPassword}
                  />
                </div>
              )}

              <ButtonField
                htmlType="submit"
                type="login"
                disabled={submitting}
                loading={submitting}
                className="w-full h-14 rounded-2xl text-base font-semibold tracking-widest uppercase shadow-xl shadow-orange-500/20"
              >
                {step === 1 ? "Gửi mã xác thực" : step === 2 ? "Xác minh OTP" : "Cập nhật mật khẩu"}
              </ButtonField>

              <CustomButton
                onClick={() => step === 1 ? router.push("/login") : setStep(prev => (prev - 1) as any)}
                variant="dark"
                className="h-14 w-full rounded-full shadow-lg uppercase tracking-widest font-semibold"
                icon={<MoveLeft size={18} />}
              >
                {step === 1 ? "Quay lại đăng nhập" : "Quay lại bước trước"}
              </CustomButton>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-4 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl">
                <MdSecurity className="text-amber-500 text-2xl shrink-0" />
                <div className="text-[11px] text-amber-800 dark:text-amber-300 font-bold leading-tight">
                  Tuyệt đối không chia sẻ mã OTP hoặc mật khẩu với bất kỳ ai, kể cả nhân viên hệ thống CaLaTha.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
             Bạn cần trợ giúp? <a href="#" className="font-bold text-orange-600 hover:underline">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    </div>
  );
}