/* eslint-disable @typescript-eslint/no-explicit-any */

import { useToast } from "@/hooks/useToast";
import { authService } from "@/auth/services/auth.service";
import { ApiResponse } from "@/api/_types/api.types";
import { isLocalhost } from "./env";

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

/**
 * ✅ HÀM XÓA COOKIE TRIỆT ĐỂ
 * Thử xóa trên nhiều path và domain khác nhau để đảm bảo sạch dữ liệu
 */
export const deleteCookie = (name: string): void => {
  if (typeof document === "undefined") return;

  // 1. Xóa cơ bản
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

  // 2. Xóa với Domain hiện tại
  const domain = window.location.hostname;
  document.cookie = `${name}=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

  // 3. Xóa cho sub-domain (ví dụ xóa cho .yourdomain.com)
  const domainParts = domain.split(".");
  if (domainParts.length > 2) {
    const rootDomain = `.${domainParts.slice(-2).join(".")}`;
    document.cookie = `${name}=; Path=/; Domain=${rootDomain}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const isLoggedIn = getCookie("isLoggedIn");
  const hasToken =
    localStorage.getItem("accessToken") || getCookie("accessToken");
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
 * ✅ CẬP NHẬT: Xóa sạch cả LocalStorage và Cookies cho các key nhạy cảm
 */
export const clearTokens = (): void => {
  if (typeof window === "undefined") return;

  // 1. Các key trong LocalStorage
  const keysToRemove = [
    "accessToken",
    "refreshToken",
    "users",
    "userDetail",
    "userRole",
    "token",
    "user",
  ];
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  // 2. Các key trong SessionStorage
  sessionStorage.removeItem("checkoutPreview");
  sessionStorage.removeItem("checkoutRequest");

  // 3. Các key trong Cookies (Quan trọng nhất)
  const cookiesToRemove = [
    "accessToken",
    "refreshToken",
    "isLoggedIn",
    "users",
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
    window.location.href = `${loginPath}?returnUrl=${encodeURIComponent(returnUrl)}`;
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
  context: "default" | "employee" | "shop" = "default",
): Promise<void> => {
  if (typeof window === "undefined") return;

  const redirectPath = REDIRECT_MAP[context] || REDIRECT_MAP.default;

  // Lấy token từ cả 2 nguồn để gửi lên Backend logout
  const refreshToken =
    localStorage.getItem("refreshToken") || getCookie("refreshToken") || "";

  try {
    // Luôn cố gắng logout ở backend nếu có token
    if (refreshToken) {
      await authService.logout({ refreshToken });
    }
  } catch (error) {
    console.error("Backend logout failed, forcing client logout:", error);
  } finally {
    // ✅ Luôn xóa sạch ở client bất kể backend có lỗi hay không
    clearTokens();
    window.location.href = redirectPath;
  }
};

export const logoutEmployee = (): Promise<void> => logout("employee");
export const logoutShop = (): Promise<void> => logout("shop");

// ==================== AUTH VERIFICATION FLOW ====================

export const verifyAuth = async (
  options?: VerifyAuthOptions,
): Promise<VerifyAuthResult<any>> => {
  const { redirectOnFailure = false, pathname } = options || {};
  const { error: toastError } = useToast();
  // Logic Localhost...
  if (isLocalhost()) {
    const user = getCachedUser();
    if (user && (user.userId || user.buyerId)) {
      return { authenticated: true, user };
    } else {
      clearTokens();
      if (redirectOnFailure) redirectToLogin(pathname);
      return { authenticated: false, user: null };
    }
  }

  // Check Auth chính thức
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
      throw new Error("Invalid response");
    }
  } catch (error: any) {
    const is401 = error?.response?.status === 401 || error?.code === 401;

    if (is401 && redirectOnFailure) {
      toastError("Phiên đăng nhập đã hết hạn", {
        description: "Vui lòng đăng nhập lại.",
      });
      clearTokens();
      redirectToLogin(pathname);
    }
    return { authenticated: false, user: null };
  }
};

interface VerifyAuthOptions {
  redirectOnFailure?: boolean;
  pathname?: string;
}

interface VerifyAuthResult<T> {
  authenticated: boolean;
  user: T | null;
}
