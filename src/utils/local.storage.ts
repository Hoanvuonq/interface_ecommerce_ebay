/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "sonner";
import { authService } from "@/auth/services/auth.service";
import { ApiResponse } from "@/api/_types/api.types";
import { isLocalhost } from "./env";

// ==================== COOKIE UTILITIES ====================

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

/**
 * ✅ THÊM HÀM XÓA COOKIE
 * Set ngày hết hạn về quá khứ để trình duyệt tự xóa
 */
export const deleteCookie = (name: string): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  // Xóa thêm cho domain hiện tại (phòng trường hợp cookie set không có domain cụ thể)
  document.cookie = `${name}=; Path=/; Domain=${window.location.hostname}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const isLoggedIn = getCookie("isLoggedIn");
  // Check thêm accessToken trong localStorage cho chắc chắn
  const hasToken = localStorage.getItem("accessToken");
  return isLoggedIn === "true" || !!hasToken;
};

export const getCachedUser = (): any | null => {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem("users");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing cached user:", error);
    return null;
  }
};

/**
 * ✅ CẬP NHẬT: Xóa đúng tên key trong ảnh (accessToken, refreshToken, users)
 * Và xóa cả Cookies
 */
export const clearTokens = (): void => {
  if (typeof window === "undefined") return;

  // 1. Xóa LocalStorage (Đúng tên key như trong ảnh DevTools của bạn)
  const keysToRemove = [
    "accessToken",
    "refreshToken",
    "users",
    "userDetail",
    "userRole",
    "token", // Giữ lại phòng hờ code cũ
    "user",  // Giữ lại phòng hờ code cũ
  ];

  keysToRemove.forEach((key) => localStorage.removeItem(key));

  // 2. Xóa SessionStorage
  sessionStorage.removeItem("checkoutPreview");
  sessionStorage.removeItem("checkoutRequest");

  // 3. Xóa Cookies
  const cookiesToRemove = [
    "accessToken",
    "refreshToken",
    "isLoggedIn",
    "users"
  ];
  cookiesToRemove.forEach((name) => deleteCookie(name));
};

// ==================== REDIRECT & LOGOUT LOGIC ====================

const redirectToLogin = (pathname?: string): void => {
  if (typeof window === "undefined") return;

  let loginPath = "/login";
  if (pathname?.startsWith("/shop")) {
    loginPath = "/shop/login";
  } else if (
    pathname?.startsWith("/employee") ||
    pathname?.startsWith("/manager")
  ) {
    loginPath = "/employee/login";
  }

  const currentPath = pathname || window.location.pathname;
  const returnUrl = currentPath !== loginPath ? currentPath : undefined;

  if (returnUrl) {
    window.location.href = `${loginPath}?returnUrl=${encodeURIComponent(
      returnUrl
    )}`;
  } else {
    window.location.href = loginPath;
  }
};

const REDIRECT_MAP: Record<string, string> = {
  employee: "/employee/login",
  shop: "/shop/login",
  default: "/",
};

export const logout = async (
  context: "default" | "employee" | "shop" = "default"
): Promise<void> => {
  if (typeof window === "undefined") return;

  const redirectPath = REDIRECT_MAP[context] || REDIRECT_MAP.default;

  const refreshToken = 
    localStorage.getItem("refreshToken") || 
    getCookie("refreshToken") || 
    "";

  try {
    if (refreshToken) {
      await authService.logout({ refreshToken });
    }
  } catch (error) {
    console.error("Backend logout failed, forcing client logout:", error);
  }

  clearTokens();

  // 4. Redirect
  window.location.href = redirectPath;
};

export const logoutEmployee = (): Promise<void> => logout("employee");
export const logoutShop = (): Promise<void> => logout("shop");

// ==================== AUTH VERIFICATION FLOW ====================

interface VerifyAuthOptions {
  redirectOnFailure?: boolean;
  pathname?: string;
}

interface VerifyAuthResult<T> {
  authenticated: boolean;
  user: T | null;
}

export const verifyAuth = async (
  options?: VerifyAuthOptions
): Promise<VerifyAuthResult<any>> => {
  const { redirectOnFailure = false, pathname } = options || {};

  if (isLocalhost()) {
    const user = getCachedUser();
    if (user && (user.userId || user.buyerId)) {
      return { authenticated: true, user };
    } else {
      console.warn("⚠️ Local Auth Failed: No user found in localStorage");
      clearTokens();
      if (redirectOnFailure) redirectToLogin(pathname);
      return { authenticated: false, user: null };
    }
  }

  if (!isAuthenticated()) {
    clearTokens();
    if (redirectOnFailure) redirectToLogin(pathname);
    return { authenticated: false, user: null };
  }

  try {
    const response: ApiResponse<any> = await authService.getCurrentUser();
    if (response?.success && response?.data) {
      localStorage.setItem("users", JSON.stringify(response.data));
      return { authenticated: true, user: response.data };
    } else {
      clearTokens();
      if (redirectOnFailure) redirectToLogin(pathname);
      return { authenticated: false, user: null };
    }
  } catch (error: any) {
    const is401 = error?.response?.status === 401 || error?.code === 401;
    const isRefreshTokenExpired = error?.response?.data?.code === 2011;

    if ((is401 || isRefreshTokenExpired) && redirectOnFailure) {
      toast.error("Phiên đăng nhập đã hết hạn", {
        description: "Vui lòng đăng nhập lại để tiếp tục sử dụng.",
        duration: 5000,
      });

      clearTokens();
      redirectToLogin(pathname);
    } else {
      // Chỉ clear token nếu lỗi nghiêm trọng, tránh clear khi mạng lag
      if (is401) clearTokens();
    }

    return { authenticated: false, user: null };
  }
};