"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaShoppingBag, FaStore } from "react-icons/fa";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

import { useLoginBuyer, useLoginShop, useLoginSocial } from "@/auth/_hooks/useAuth"; 
import { LoginRequest, RoleEnum } from "@/auth/_types/auth";
import authService from "@/auth/services/auth.service";
import { getRedirectPath, getStoredUserDetail, hasRole } from "@/utils/jwt";

// Components
import { InputField } from "@/components/inputField";
import { ButtonField } from "@/components/buttonField";
import { LeftSideForm } from "../LeftSideForm";
import { MobileFeatureList } from "../LeftSideForm/_components/FeatureMobile";
import { AUTH_PANEL_DATA, AuthPanelType } from "../../_constants/future";
import { Design } from "@/components";

type LoginMode = "BUYER" | "SHOP";

interface UniversalLoginFormProps {
  mode: LoginMode;
}

const MODE_CONFIG = {
  BUYER: {
    panelType: "return_customer" as AuthPanelType,
    storageKeyUser: "pendingLoginUsername_user",
    storageKeyEmail: "pendingLoginEmail_user",
    storageKeyPass: "pendingLoginPassword_user",
    registerLink: "/register",
    forgotPassLink: "/forgot-password",
    role: "BUYER",
    welcomeTitle: "Đăng Nhập",
    welcomeDesc: "Nhập thông tin tài khoản để tiếp tục",
    homeText: "Về trang chủ",
    homeLink: "/"
  },
  SHOP: {
    panelType: "return_seller" as AuthPanelType,
    storageKeyUser: "pendingLoginUsername_shop",
    storageKeyEmail: "pendingLoginEmail_shop",
    storageKeyPass: "pendingLoginPassword_shop",
    registerLink: "/shop/register",
    forgotPassLink: "/shop/forgot-password", 
    role: "SHOP",
    welcomeTitle: "Đăng Nhập Shop",
    welcomeDesc: "Nhập thông tin tài khoản quản lý shop",
    homeText: "Về trang chủ",
    homeLink: "/"
  }
};

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

// --- SUB COMPONENTS ---
const SocialButton: React.FC<{
  provider: "GOOGLE" | "FACEBOOK";
  onClick: () => void;
  loading: boolean;
}> = ({ provider, onClick, loading }) => {
  const displayLabel = provider.charAt(0) + provider.slice(1).toLowerCase();
  const icon = provider === "GOOGLE" ? <FcGoogle size={22} /> : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  return (
    <ButtonField
      type="secondary"
      icon={icon}
      onClick={onClick}
      disabled={loading}
      loading={loading}
      className={cn(
        "h-12 rounded-xl border-2 border-gray-200 dark:border-slate-700",
        "hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md",
        "transition-all duration-300 font-medium text-base bg-white",
        "dark:bg-slate-700/50 dark:text-gray-200"
      )}
    >
      {displayLabel}
    </ButtonField>
  );
};

// --- MAIN COMPONENT ---
export function UniversalLoginForm({ mode }: UniversalLoginFormProps) {
  const router = useRouter();
  const config = MODE_CONFIG[mode];

  // Logic Hooks: Gọi cả 2 hook nhưng chỉ dùng 1 cái dựa trên mode
  const loginBuyer = useLoginBuyer();
  const loginShop = useLoginShop();
  const { handleLoginSocial } = useLoginSocial();

  // Unified Loading & Error State
  const loading = mode === "BUYER" ? loginBuyer.loading : loginShop.loading;
  const error = mode === "BUYER" ? loginBuyer.error : loginShop.error;

  const [formData, setFormData] = useState<LoginRequest>({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState<Partial<LoginRequest>>({});
  const [submitting, setSubmitting] = useState(false);
  const [socialLoginLoading, setSocialLoginLoading] = useState({ GOOGLE: false, FACEBOOK: false });

  const usernameRef = useRef<HTMLInputElement>(null);

  // Focus & Load Saved Info
  useEffect(() => {
    usernameRef.current?.focus();

    const pendingUsername = localStorage.getItem(config.storageKeyUser);
    const pendingEmail = localStorage.getItem(config.storageKeyEmail);
    const pendingPassword = localStorage.getItem(config.storageKeyPass);

    const formValues: Partial<LoginRequest> = {};
    if (pendingUsername) {
      formValues.username = pendingUsername;
      localStorage.removeItem(config.storageKeyUser);
    } else if (pendingEmail) {
      formValues.username = pendingEmail;
      localStorage.removeItem(config.storageKeyEmail);
    }
    if (pendingPassword) {
      formValues.password = pendingPassword;
      localStorage.removeItem(config.storageKeyPass);
    }

    if (Object.keys(formValues).length > 0) {
      setFormData((prev) => ({ ...prev, ...formValues }));
    }
  }, [config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof LoginRequest]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // --- LOGIC XỬ LÝ ĐĂNG NHẬP (Strategy Pattern) ---
  const processLogin = async () => {
    if (mode === "BUYER") {
      // Logic cho BUYER
      const res = await loginBuyer.handleLoginBuyer(formData);
      return { res, type: "BUYER" };
    } else {
      // Logic cho SHOP
      const res = await loginShop.handleLoginShop(formData);
      return { res, type: "SHOP" };
    }
  };

  const onFinish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateForm(formData);
    if (errors) {
      setFormErrors(errors);
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setSubmitting(true);
    try {
      const { res } = await processLogin();

      // Xử lý chung: Email chưa verify
      if (res && res?.data?.emailVerified === false) {
        toast.warning("Tài khoản chưa kích hoạt. Vui lòng xác thực email.");
        router.push(`/account/verify?email=${encodeURIComponent(res?.data?.email)}`);
        return;
      }

      if (res && res?.success) {
        // Lưu thông tin user
        if (res?.data?.user) {
          authService.storeUserInfoFromResponse(res.data.user);
        }
        await authService.fetchAndStoreUserDetail();
        toast.success("Đăng nhập thành công!");

        // --- ĐIỀU HƯỚNG RIÊNG BIỆT ---
        if (mode === "BUYER") {
          const redirectPath = getRedirectPath();
          router.push(redirectPath);
        } else {
          // Logic điều hướng của SHOP
          const userDetail = getStoredUserDetail();
          if (hasRole(RoleEnum.SHOP)) {
             router.push("/shop/dashboard");
          } else if (userDetail?.shopId) {
             toast.info("Hồ sơ shop đang được xem xét");
             router.push("/shop/check");
          } else {
             toast.info("Vui lòng tạo thông tin shop");
             router.push("/shop/onboarding");
          }
        }
      } else {
        // Xử lý lỗi từ API trả về
        toast.error(error || res?.message || "Đăng nhập thất bại.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = async (loginType: "GOOGLE" | "FACEBOOK") => {
    setSocialLoginLoading((prev) => ({ ...prev, [loginType]: true }));
    try {
      // Gọi social login với role tương ứng
      const res = await handleLoginSocial({ 
        loginType, 
        role: config.role as "BUYER" | "SHOP" 
      });
      
      if (res?.success && res?.data) {
        window.location.href = res.data;
      } else {
        toast.error(res?.message || "Không thể khởi tạo đăng nhập");
        setSocialLoginLoading((prev) => ({ ...prev, [loginType]: false }));
      }
    } catch (err: any) {
      toast.error(err?.message || "Lỗi kết nối");
      setSocialLoginLoading((prev) => ({ ...prev, [loginType]: false }));
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      <Design /> 

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full">
        {/* LEFT SIDE: Truyền type từ config vào */}
        <div className="hidden lg:flex lg:w-1/2 w-full items-center justify-center px-4 lg:px-12">
          <LeftSideForm type={config.panelType} />
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md relative">
            
            {/* Mobile Header (Ẩn trên PC) */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  {mode === 'SHOP' ? <FaStore className="text-white text-2xl" /> : <FaShoppingBag className="text-white text-2xl" />}
                </div>
                <h2 className="mb-0 text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase">
                  {mode === 'SHOP' ? 'KÊNH NGƯỜI BÁN' : 'CALATHA'}
                </h2>
              </div>
            </div>

            {/* LOGIN CARD */}
            <div
              className={cn(
                "w-full shadow-2xl transition-all duration-300 relative z-10",
                "bg-white/90 dark:bg-slate-800/90",
                "border-2 border-pink-500/30 dark:border-pink-500/50",
                "p-8 sm:p-10 rounded-3xl backdrop-blur-md"
              )}
              style={{ backdropFilter: "blur(12px)" }}
            >
              <div className="text-center mb-8 pt-1">
                <h2 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {config.welcomeTitle}
                </h2>
                <p className="text-base text-gray-500 dark:text-gray-400">
                  {config.welcomeDesc}
                </p>
              </div>

              {/* Social Buttons */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                <SocialButton
                  provider="GOOGLE"
                  onClick={() => handleSocialLogin("GOOGLE")}
                  loading={socialLoginLoading.GOOGLE}
                />
                <SocialButton
                  provider="FACEBOOK"
                  onClick={() => handleSocialLogin("FACEBOOK")}
                  loading={socialLoginLoading.FACEBOOK}
                />
              </div>

              <div className="flex items-center my-6">
                <hr className="grow border-t border-gray-200 dark:border-slate-700" />
                <span className="px-3 text-sm text-gray-400 dark:text-gray-500">
                  hoặc đăng nhập với tài khoản
                </span>
                <hr className="grow border-t border-gray-200 dark:border-slate-700" />
              </div>

              {/* MAIN FORM */}
              <form onSubmit={onFinish} className="mb-6">
                <InputField
                  label="Tên đăng nhập"
                  name="username"
                  placeholder="Nhập tên đăng nhập"
                  ref={usernameRef}
                  value={formData.username}
                  onChange={handleInputChange}
                  errorMessage={formErrors.username}
                />

                <InputField
                  label="Mật khẩu"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  errorMessage={formErrors.password}
                />

                <div className="text-right mb-5">
                  <Link
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline"
                    href={config.forgotPassLink}
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <ButtonField
                  htmlType="submit"
                  type="login"
                  disabled={loading || submitting}
                  loading={loading || submitting}
                  className="w-full h-12 text-lg font-bold"
                >
                  Đăng Nhập
                </ButtonField>
              </form>

              <div className="text-center space-y-3 pt-4">
                <p className="text-gray-600 dark:text-gray-300">
                  {mode === 'SHOP' ? 'Chưa có tài khoản shop? ' : 'Chưa có tài khoản? '}
                  <Link
                    className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
                    href={config.registerLink}
                  >
                    Đăng ký ngay
                  </Link>
                </p>

                <div className="pt-2">
                  <Link
                    href={config.homeLink}
                    className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 text-sm"
                  >
                    <Home size={16} />
                    <span>{config.homeText}</span>
                  </Link>
                </div>
              </div>
            </div>

            {AUTH_PANEL_DATA[config.panelType] && (
              <MobileFeatureList
                features={AUTH_PANEL_DATA[config.panelType].features}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}