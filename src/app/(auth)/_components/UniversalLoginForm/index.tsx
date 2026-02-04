"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaShoppingBag, FaStore } from "react-icons/fa";
import { Home } from "lucide-react";
import { useLoginSocial } from "@/auth/_hooks/useAuth";
import { InputField } from "@/components/inputField";
import { ButtonField } from "@/components/buttonField";
import { LeftSideForm } from "../LeftSideForm";
import { MobileFeatureList } from "../LeftSideForm/_components/FeatureMobile";
import { AUTH_PANEL_DATA } from "../../_constants/future";
import { Design } from "@/components";
import { useToast } from "@/hooks/useToast";
import { SocialButton } from "../SocialButton";
import {
  MODE_CONFIG,
  UniversalLoginFormProps,
} from "../../_constants/formLogin";
import { useAuthMutation } from "../../_hooks/useAuthMutation";
import { useAuthForm, authValidation } from "../../_hooks/useAuthForm";

export function UniversalLoginForm({ mode }: UniversalLoginFormProps) {
  const config = MODE_CONFIG[mode];
  const { error: toastError } = useToast();
  const loginMutation = useAuthMutation(mode);
  const { handleLoginSocial } = useLoginSocial();

  const { formData, errors, setFormData, handleChange, handleSubmit } =
    useAuthForm({ username: "", password: "" }, authValidation.login);

  const [socialLoginLoading, setSocialLoginLoading] = useState({
    GOOGLE: false,
    FACEBOOK: false,
  });
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
    const keys = [
      config.storageKeyUser,
      config.storageKeyEmail,
      config.storageKeyPass,
    ];
    const [user, email, pass] = keys.map((k) => localStorage.getItem(k));

    if (user || email || pass) {
      setFormData({
        username: user || email || "",
        password: pass || "",
      });
      keys.forEach((k) => localStorage.removeItem(k));
    }
  }, [config, setFormData]);

  const onFinish = (values: typeof formData) => {
    loginMutation.mutate({
      username: values.username!,
      password: values.password!,
    });
  };

  const handleSocialLogin = async (loginType: "GOOGLE" | "FACEBOOK") => {
    setSocialLoginLoading((prev) => ({ ...prev, [loginType]: true }));
    try {
      const res = await handleLoginSocial({
        loginType,
        role: config.role as any,
      });
      if (res?.success && res?.data) window.location.href = res.data;
      else
        toastError("Lỗi khởi tạo", {
          description: res?.message || "Không thể kết nối MXH.",
        });
    } catch (err) {
      toastError("Lỗi kết nối", {
        description: "Kiểm tra lại đường truyền mạng.",
      });
    } finally {
      setSocialLoginLoading((prev) => ({ ...prev, [loginType]: false }));
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Design />
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full">
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center px-4 lg:px-12">
          <LeftSideForm type={config.panelType} />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md relative">
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  {mode === "SHOP" ? (
                    <FaStore className="text-white text-2xl" />
                  ) : (
                    <FaShoppingBag className="text-white text-2xl" />
                  )}
                </div>
                <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase">
                  {mode === "SHOP" ? "KÊNH NGƯỜI BÁN" : "CALATHA"}
                </h2>
              </div>
            </div>

            <div className="w-full shadow-2xl bg-white/90 dark:bg-gray-800/90 border-2 border-pink-500/30 p-8 sm:p-10 rounded-3xl backdrop-blur-md">
              <div className="text-center mb-8 space-y-3">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {config.welcomeTitle}
                </h2>
                <p className="text-base text-gray-500 dark:text-gray-600">
                  {config.welcomeDesc}
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3">
                <SocialButton
                  provider="GOOGLE"
                  icon={<FcGoogle size={22} />}
                  onClick={() => handleSocialLogin("GOOGLE")}
                  loading={socialLoginLoading.GOOGLE}
                />
                <SocialButton
                  provider="FACEBOOK"
                  icon={<FaFacebook size={22} color="#1877F2" />}
                  onClick={() => handleSocialLogin("FACEBOOK")}
                  loading={socialLoginLoading.FACEBOOK}
                />
              </div>

              <div className="flex items-center my-6 text-gray-600 text-sm italic">
                <hr className="grow border-gray-200" />
                <span className="px-3">hoặc đăng nhập bằng tài khoản</span>
                <hr className="grow border-gray-200" />
              </div>

              <form
                onSubmit={handleSubmit(onFinish)}
                className="space-y-4 mb-6"
              >
                <InputField
                  label="Tên đăng nhập"
                  name="username"
                  placeholder="Nhập tên đăng nhập"
                  ref={usernameRef}
                  value={formData.username}
                  onChange={handleChange}
                  errorMessage={errors.username}
                />
                <InputField
                  label="Mật khẩu"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  errorMessage={errors.password}
                />

                <div className="text-right">
                  <Link
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    href={config.forgotPassLink}
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <ButtonField
                  htmlType="submit"
                  type="login"
                  disabled={loginMutation.isPending}
                  loading={loginMutation.isPending}
                  className="w-full h-12 text-lg font-bold"
                >
                  Đăng Nhập
                </ButtonField>
              </form>

              <div className="text-center space-y-3 pt-4 border-t border-gray-100">
                <p className="text-gray-600 text-sm">
                  {mode === "SHOP"
                    ? "Chưa có tài khoản shop? "
                    : "Chưa có tài khoản? "}
                  <Link
                    className="text-orange-600 font-semibold"
                    href={config.registerLink}
                  >
                    Đăng ký ngay
                  </Link>
                </p>
                <Link
                  href={config.homeLink}
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  <Home size={16} /> <span>{config.homeText}</span>
                </Link>
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
