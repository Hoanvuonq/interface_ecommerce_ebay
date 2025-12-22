"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import authService from "../services/auth.service";
import { verifyAuth } from "@/utils/local.storage";
import { usePathname } from "next/navigation";

import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  Oauth2LoginCallBackRequest,
  Oauth2LoginRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
  UpdateBuyerClientRequest,
  UpdateEmployeeClientRequest,
  UpdateUserClientRequest,
  VerifyPasswordRequest,
} from "../_types/auth";
import { RegisterRequest } from "../_types/auth";
import { VerifyRequest } from "../_types/auth";
import { ResendOtpRequest } from "../_types/auth";
import { CreateImageRequest } from "@/types/employee/dto";
import { ApiResponse } from "@/api/_types/api.types";
import { isLocalhost } from "@/utils/env";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (
    payload: LoginRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(payload);
      console.log("Login response:", res);
      // Nếu ở local, lưu user vào localStorage
      if (typeof window !== "undefined" && isLocalhost() && res && res.success && res.data) {
        localStorage.setItem("users", JSON.stringify(res.data));
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}

export function useLoginBuyer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginBuyer = async (
    payload: LoginRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.loginBuyer(payload);
      console.log("Buyer login response:", res);
      return res;
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLoginBuyer, loading, error };
}

export function useLoginShop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginShop = async (
    payload: LoginRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.loginShop(payload);
      console.log("Shop login response:", res);
      // ✅ Backend tự set cookies, không cần lưu vào localStorage
      return res;
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLoginShop, loading, error };
}

export function useLoginStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginStaff = async (
    payload: LoginRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.loginStaff(payload);
      console.log("Staff login response:", res);
      // ✅ Backend tự set cookies, không cần lưu vào localStorage
      return res;
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLoginStaff, loading, error };
}

export function useRegisterBuyer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterBuyer = async (
    payload: RegisterRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.registerBuyer(payload);
      return res;
    } catch (err: any) {
      console.log("Error register buyer:", err);
      setError(err?.message || "Đăng ký thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegisterBuyer, loading, error };
}

export function useRegisterShop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegisterShop = async (
    payload: RegisterRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.registerShop(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Đăng ký thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegisterShop, loading, error };
}

export function useVerify() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (
    payload: VerifyRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.verifyAccount(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Xác thực thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleVerify, loading, error };
}

export function useSendOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (payload: {
    email: string;
  }): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.sendMailOtp(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Gửi email OTP thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleSendOtp, loading, error };
}

export function useResendOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResendOtp = async (
    payload: ResendOtpRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.resendOtp(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Gửi lại OTP thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleResendOtp, loading, error };
}

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async (
    payload: ForgotPasswordRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.forgotPassword(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Gửi lại OTP thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleForgotPassword, loading, error };
}

export function useVerifyPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyPassword = async (
    payload: VerifyPasswordRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.verifyPassword(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Xác thực OTP thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleVerifyPassword, loading, error };
}

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (
    payload: ResetPasswordRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.resetPassword(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Đặt lại mật khẩu thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleResetPassword, loading, error };
}

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async (
    userId: string,
    payload: ChangePasswordRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.changePassword(userId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Đổi mật khẩu thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleChangePassword, loading, error };
}

export function useGetUserDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUserDetail = async (
    userId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.getUserDetailById(userId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Thông tin chi tiết user thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetUserDetail, loading, error };
}

export function useRefreshToken() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefreshToken = async (
    payload: RefreshTokenRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.refreshToken(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Làm mới token thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRefreshToken, loading, error };
}

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async (
    payload: LogoutRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.logout(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Đăng xuất thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout, loading, error };
}

export function useUpdateEmployeeClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateEmployeeClient = async (
    employeeId: string,
    payload: UpdateEmployeeClientRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.updateEmployeeClient(employeeId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật thông tin nhân viên thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateEmployeeClient, loading, error };
}

export function useUpdateBuyerClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateBuyerClient = async (
    buyerId: string,
    payload: UpdateBuyerClientRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.updateBuyerClient(buyerId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật thông tin người mua thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateBuyerClient, loading, error };
}

export function useUpdateUserClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUserClient = async (
    userId: string,
    payload: UpdateUserClientRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.updateUserClient(userId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật thông tin tài khoản thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateUserClient, loading, error };
}

export function useUploadImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadImage = async (
    payload: CreateImageRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.uploadImage(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tải lên hình ảnh thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUploadImage, loading, error };
}

export function useLoginSocial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSocial = async (
    payload: Oauth2LoginRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.loginSocial(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thông qua mạng xã hội thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLoginSocial, loading, error };
}

export function useLoginSocialCallback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSocialCallback = async (
    payload: Oauth2LoginCallBackRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.loginSocialCallback(payload);
      return res;
    } catch (err: any) {
      setError(
        err?.message || "Xử lý đăng nhập thông qua mạng xã hội thất bại"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLoginSocialCallback, loading, error };
}

/**
 * Hook để verify authentication khi page load / private route
 * ✅ Tự động gọi verifyAuth với logic refresh token
 * ✅ Flow: Check isLoggedIn cookie → If true → Call /me → If 200 OK → Update UI → If 401 → Refresh token → Retry /me → Update UI
 *
 * @param options - Options cho auth verification
 * @param options.redirectOnFailure - Có redirect đến login khi thất bại không (default: true)
 * @param options.autoVerify - Có tự động verify khi mount không (default: true)
 * @returns Object với authenticated status, user, loading, và error
 */
export function useAuthVerification(options?: {
  redirectOnFailure?: boolean;
  autoVerify?: boolean;
}) {
  const { redirectOnFailure = true, autoVerify = true } = options || {};
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(autoVerify);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await verifyAuth({
        redirectOnFailure,
        pathname: pathname || undefined,
      });

      setAuthenticated(result.authenticated);
      setUser(result.user);

      return result;
    } catch (err: any) {
      const errorMessage = err?.message || "Xác thực thất bại";
      setError(errorMessage);
      setAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [redirectOnFailure, pathname]);

  useEffect(() => {
    if (autoVerify) {
      verify();
    }
  }, [autoVerify, verify]); 

  return {
    authenticated,
    user,
    loading,
    error,
    verify, // Expose verify function để có thể gọi thủ công
  };
}
