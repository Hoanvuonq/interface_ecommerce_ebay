"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVerify, useResendOtp, useSendOtp } from "@/auth/_hooks/useAuth";
import { Design } from "@/components"; 
import { ButtonField } from "@/components/buttonField";
import { FaEnvelopeOpenText, FaShieldAlt } from "react-icons/fa";
import { MdEmail, MdTimer, MdRefresh } from "react-icons/md"; 
import { toast } from "sonner"; // Keep for success messages
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast"; 
import { useVerifyForm } from "../../_hooks/useVerifyForm";

const Title = ({ level, className, children }: { level: number; className?: string; children: React.ReactNode }) => {
  const Tag = `h${level}` as React.ElementType;
  return <Tag className={className}>{children}</Tag>;
};

const Text = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <span className={className}>{children}</span>;
};

type VerifyFormProps = {
  email: string;
  type: "user" | "shop";
  mode?: "REGISTRATION" | "ACTIVATION";
  onSuccess?: () => void; 
};

export function VerifyForm({ email, type, mode = "REGISTRATION", onSuccess }: VerifyFormProps) {
  const router = useRouter();
  const { handleVerify, loading: verifyLoading, error: verifyError } = useVerify();
  const { handleResendOtp, loading: resendLoading } = useResendOtp();
  const { handleSendOtp } = useSendOtp();
  const { error: toastError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { 
    otp, 
    countdown, 
    inputRefs, 
    handleChange, 
    handleKeyDown, 
    handlePaste,
    resetOtp,
    resetCountdown
  } = useVerifyForm({
    email,
    mode,
    onSendInitialOtp: async () => {
        try {
            await handleSendOtp({ email });
            toast.success("Mã xác thực mới đã được gửi tới email.");
        } catch (err: any) {
             toastError("Lỗi gửi mã", { description: err?.message });
        }
    }
  });

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
        toast.warning("Vui lòng nhập đủ 6 chữ số");
        return;
    }

    setSubmitting(true);
    try {
      const res = await handleVerify({ email, otpCode });
      if (res) {
        toast.success("Xác thực thành công!");
        
        if (mode === "REGISTRATION") {
            const savedForm = localStorage.getItem(`registerForm_${type}`);
            if (savedForm) {
              try {
                const formData = JSON.parse(savedForm);
                if (formData.username) localStorage.setItem(`pendingLoginUsername_${type}`, formData.username);
                if (formData.password) localStorage.setItem(`pendingLoginPassword_${type}`, formData.password);
              } catch {}
            }
        }

        if (onSuccess) {
            onSuccess();
        } else {
            setTimeout(() => router.push(type === 'shop' ? '/shop/login' : '/login'), 1500);
        }

      } else {
        toastError("Xác thực thất bại", { description: verifyError || "Mã xác thực không đúng." });
        resetOtp();
      }
    } catch (err: any) {
      toastError("Lỗi hệ thống", { description: err?.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await handleResendOtp({ email, otpType: "ACCOUNT_ACTIVATION" });
      toast.success("Mã mới đã được gửi!");
      resetCountdown();
      resetOtp();
    } catch (err: any) {
      toastError("Lỗi gửi lại mã", { description: err?.message });
    }
  };

  const handleCancel = () => {
    if (mode === "REGISTRATION") {
        localStorage.removeItem(`registerStep_${type}`);
        localStorage.removeItem(`registerForm_${type}`);
        localStorage.removeItem(`registerChecked_${type}`);
        window.location.href = type === 'shop' ? '/shop/register' : '/register';
    } else {
        router.push(type === 'shop' ? '/shop/login' : '/login');
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Design />
      <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
        <div className={cn(
            "w-full shadow-2xl transition-all duration-300",
            "bg-white/80 dark:bg-gray-800/80",
            "border border-white/60 dark:border-gray-700/60",
            "p-8 sm:p-10 rounded-4xl backdrop-blur-xl"
          )}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative w-20 h-20 bg-linear-to-br from-orange-500 to-red-500 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <FaEnvelopeOpenText className="text-white text-3xl drop-shadow-md" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                </div>
              </div>
            </div>

            <Title level={2} className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
              {mode === "ACTIVATION" ? "Kích hoạt tài khoản" : "Xác thực Email"}
            </Title>
            
            <div className="flex flex-col items-center gap-2">
              <Text className="text-gray-500 dark:text-gray-600 text-sm">
                {mode === "ACTIVATION" 
                    ? "Tài khoản chưa kích hoạt. Mã xác thực đã gửi đến:" 
                    : "Mã xác thực 6 số đã được gửi đến:"}
              </Text>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50 rounded-full">
                <MdEmail className="text-orange-500 text-sm" />
                <Text className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                  {email}
                </Text>
              </div>
            </div>
          </div>

          <form onSubmit={onFinish} className="space-y-8">
            <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((data, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={data}
                        ref={el => { inputRefs.current[index] = el }}
                        onChange={e => handleChange(e.target, index)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        onFocus={e => e.target.select()}
                        className={cn(
                            "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none",
                            "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:-translate-y-1",
                            "bg-gray-50 border-gray-200 text-gray-800",
                            "dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-100",
                            data ? "border-orange-500/50 dark:border-orange-500/50 bg-white dark:bg-gray-700 shadow-sm" : ""
                        )}
                    />
                ))}
            </div>

            <div className="flex flex-col items-center gap-3">
              {countdown > 0 ? (
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-600 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                  <MdTimer className="text-base text-orange-500" />
                  <span>Gửi lại sau <span className="text-orange-600 dark:text-orange-400 font-bold">{countdown}s</span></span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={resendLoading}
                  onClick={handleResend}
                  className="group flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 transition-colors"
                >
                  <MdRefresh className={cn("text-lg group-hover:rotate-180 transition-transform duration-500", resendLoading && "animate-spin")} />
                  {resendLoading ? "Đang gửi..." : "Gửi lại mã mới"}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <ButtonField
                htmlType="submit"
                type="login"
                className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-orange-500/20 border-0 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all hover:scale-[1.02]"
                disabled={verifyLoading || submitting}
                loading={verifyLoading || submitting}
              >
                Xác thực ngay
              </ButtonField>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full h-12 rounded-xl text-base font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {mode === "REGISTRATION" ? "Quay lại đăng ký" : "Quay lại đăng nhập"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex gap-3 px-2">
              <div className="mt-0.5 text-green-500 dark:text-green-400">
                <FaShieldAlt className="text-lg" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                  Lưu ý bảo mật
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-600 leading-relaxed">
                  Mã OTP chỉ có hiệu lực trong 10 phút. Tuyệt đối không chia sẻ mã này cho bất kỳ ai.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center animate-fade-in delay-100">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-600 opacity-80 hover:opacity-100 transition-opacity cursor-default bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full inline-block backdrop-blur-sm shadow-sm">
            💡 Mẹo: Kiểm tra cả hộp thư <span className="font-semibold text-gray-700 dark:text-gray-200">Spam</span> nếu không thấy email
          </p>
        </div>
      </div>
    </div>
  );
}