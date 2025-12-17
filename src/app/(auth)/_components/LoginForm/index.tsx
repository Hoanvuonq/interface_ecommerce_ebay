"use client";

import { useLoginBuyer, useLoginSocial } from "@/auth/_hooks/useAuth";
import { LoginRequest } from "@/auth/_types/auth";
import React, { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaShoppingBag } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { InputField } from "@/components";
import { ButtonField } from "@/components";
import { getRedirectPath } from "@/utils/jwt";
import authService from "@/auth/services/auth.service";
import { AUTH_PANEL_DATA } from "../../_constants/future";
import { LeftSideForm } from "../LeftSideForm";
import { MobileFeatureList } from "../LeftSideForm/_components/FeatureMobile";
import { Home } from "lucide-react";
import { toast } from "sonner";
import {cn} from "@/utils/cn";

const validateForm = (values: LoginRequest): Partial<LoginRequest> | null => {
  let errors: Partial<LoginRequest> = {};
  if (!values.username || values.username.trim() === "") {
    errors.username = "Tên đăng nhập là bắt buộc.";
  }
  if (!values.password || values.password.trim() === "") {
    errors.password = "Mật khẩu là bắt buộc.";
  }
  return Object.keys(errors).length > 0 ? errors : null;
};

interface SocialButtonProps {
  provider: "GOOGLE" | "FACEBOOK";
  icon: React.ReactNode;
  onClick: () => void;
  loading: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  icon,
  onClick,
  loading,
}) => {
  const displayLabel = provider.charAt(0) + provider.slice(1).toLowerCase();
  return (
    <ButtonField
      type="secondary"
      icon={icon}
      onClick={onClick}
      disabled={loading}
      loading={loading}
      className="h-12 rounded-xl border-2 border-gray-300 dark:border-slate-700 
                       hover:border-pink-500 dark:hover:border-pink-500 hover:shadow-md 
                       transition-all duration-300 font-medium text-base 
                       dark:bg-slate-700/50 dark:text-gray-200"
    >
      {displayLabel}
    </ButtonField>
  );
};

export function LoginForm() {
  const { handleLoginBuyer, loading, error } = useLoginBuyer();
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<LoginRequest>>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const theme = useSelector((state: RootState) => state.theme.name);
  const { handleLoginSocial } = useLoginSocial();
  const [socialLoginLoading, setSocialLoginLoading] = useState({
    GOOGLE: false,
    FACEBOOK: false,
  });
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  useEffect(() => {
    const pendingUsername = localStorage.getItem("pendingLoginUsername_user");
    const pendingEmail = localStorage.getItem("pendingLoginEmail_user");
    const pendingPassword = localStorage.getItem("pendingLoginPassword_user");
    const formValues: Partial<LoginRequest> = {};
    if (pendingUsername) {
      formValues.username = pendingUsername;
      localStorage.removeItem("pendingLoginUsername_user");
    } else if (pendingEmail) {
      formValues.username = pendingEmail;
      localStorage.removeItem("pendingLoginEmail_user");
    }
    if (pendingPassword) {
      formValues.password = pendingPassword;
      localStorage.removeItem("pendingLoginPassword_user");
    }
    if (Object.keys(formValues).length > 0) {
      setFormData((prev) => ({ ...prev, ...formValues }));
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as keyof LoginRequest]: value }));
    setFormErrors((prev) => ({
      ...prev,
      [name as keyof LoginRequest]: undefined,
    }));
  };

  const onFinish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const errors = validateForm(formData);

    if (errors) {
      setFormErrors(errors);
      const firstErrorKey = Object.keys(errors)[0] as keyof LoginRequest;
      toast.error(errors[firstErrorKey] || "Vui lòng điền đầy đủ thông tin.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await handleLoginBuyer(formData);
      if (res && res?.data?.emailVerified === false) {
        toast.warning(
          "Tài khoản chưa kích hoạt. Vui lòng xác thực email để kích hoạt tài khoản."
        );
        router.push(
          `/account/verify?email=${encodeURIComponent(res?.data?.email)}`
        );
        return;
      }

      if (res && res?.success) {
        if (res?.data?.user) {
          authService.storeUserInfoFromResponse(res.data.user);
        }
        await authService.fetchAndStoreUserDetail();
        toast.success("Thành công! Bạn đã đăng nhập vào hệ thống người mua.");
        const redirectPath = getRedirectPath();
        router.push(redirectPath);
      } else {
        toast.error(
          error ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản không có vai trò người mua."
        );
      }
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        "Đăng nhập thất bại. Tài khoản này không có vai trò người mua.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = async (loginType: "GOOGLE" | "FACEBOOK") => {
    setSocialLoginLoading((prev) => ({ ...prev, [loginType]: true }));
    try {
      const res = await handleLoginSocial({ loginType, role: "BUYER" });

      if (res?.success && res?.data) {
        window.location.href = res.data;
      } else {
        toast.error(res?.message || "Không thể khởi tạo đăng nhập");
        setSocialLoginLoading((prev) => ({ ...prev, [loginType]: false }));
      }
    } catch (err: any) {
      setSocialLoginLoading((prev) => ({ ...prev, [loginType]: false }));
    }
  };

  const handleGoogleLogin = () => {
    handleSocialLogin("GOOGLE");
  };
  const handleFacebookLogin = () => {
    handleSocialLogin("FACEBOOK");
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-48 h-48 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob bg-blue-200 dark:bg-blue-900"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000 bg-purple-200 dark:bg-purple-900"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000 bg-pink-200 dark:bg-pink-900"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <LeftSideForm type="return_customer" />
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md relative">
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaShoppingBag className="text-white text-2xl" />
                </div>
                <h2 className="mb-0 text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CaLaTha
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Nền tảng thương mại điện tử hàng đầu
              </p>
            </div>
            <div
              className="w-full shadow-2xl transition-all duration-300 relative z-10 
                                       bg-white/90 dark:bg-slate-800/90 
                                       border-2 border-pink-500/30 dark:border-pink-500/50 
                                       p-8 sm:p-10 rounded-3xl backdrop-blur-md"
              style={{ backdropFilter: "blur(12px)" }}
            >
              <div className="text-center mb-8 pt-1">
                <h2 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Đăng Nhập
                </h2>
                <p className="text-base text-gray-500 dark:text-gray-400">
                  Nhập thông tin tài khoản để tiếp tục
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <SocialButton
                  provider="GOOGLE"
                  icon={<FcGoogle size={22} />}
                  onClick={handleGoogleLogin}
                  loading={socialLoginLoading.GOOGLE}
                />
                <SocialButton
                  provider="FACEBOOK"
                  icon={
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="#1877F2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  }
                  onClick={handleFacebookLogin}
                  loading={socialLoginLoading.FACEBOOK}
                />
              </div>

              {/* Divider (Giữ nguyên) */}
              <div className="flex items-center my-6">
                <hr className="flex-grow border-t border-gray-200 dark:border-slate-700" />
                <span className="px-3 text-sm text-gray-400 dark:text-gray-500">
                  hoặc đăng nhập với tài khoản
                </span>
                <hr className="flex-grow border-t border-gray-200 dark:border-slate-700" />
              </div>

              <form onSubmit={onFinish} className="mb-6">
                <InputField
                  label="Tên đăng nhập"
                  name="username"
                  placeholder="Nhập tên đăng nhập của bạn"
                  ref={usernameRef}
                  value={formData.username}
                  onChange={handleInputChange}
                  errorMessage={formErrors.username}
                />

                <InputField
                  label="Mật khẩu"
                  name="password"
                  placeholder="Nhập mật khẩu của bạn"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  errorMessage={formErrors.password}
                />

                <div className="text-right mb-5">
                  <Link
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                    href="/forgot-password"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <ButtonField
                  htmlType="submit"
                  disabled={loading || submitting}
                  loading={loading || submitting}
                >
                  Đăng Nhập
                </ButtonField>
              </form>

              <div className="text-center space-y-3 pt-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Chưa có tài khoản?{" "}
                  <Link
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    href="/register"
                  >
                    Đăng ký ngay
                  </Link>
                </p>

                <div className="pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 text-sm"
                  >
                    <Home size={16} />
                    <span>Về trang chủ</span>
                  </Link>
                </div>
              </div>
            </div>

            <MobileFeatureList
              features={AUTH_PANEL_DATA.return_customer.features}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
