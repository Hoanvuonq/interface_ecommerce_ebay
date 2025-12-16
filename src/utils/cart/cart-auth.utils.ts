/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAuthenticated as checkAuth } from "@/utils/local.storage";
import { toast } from "sonner";

/**
 * Check if user is authenticated
 * ✅ Dựa vào user info trong localStorage (backend set cookies tự động)
 */
export const isAuthenticated = (): boolean => {
  return checkAuth();
};

/**
 * Check if user is authenticated, show message and redirect if not
 */
export const requireAuthentication = (
  redirectUrl: string = "/cart"
): boolean => {
  if (!isAuthenticated()) {
    toast.warning("Vui lòng đăng nhập để sử dụng giỏ hàng", {
      duration: 3000,
    });
    setTimeout(() => {
      window.location.href = `/login?redirect=${encodeURIComponent(
        redirectUrl
      )}`;
    }, 500);

    return false;
  }
  return true;
};

/**
 * Get user token - DEPRECATED: Tokens được lưu trong HttpOnly cookies
 * ✅ Backend tự đọc từ cookies, frontend không cần token
 */
export const getAuthToken = (): string | null => {
  // ✅ Tokens được lưu trong HttpOnly cookies, không thể đọc từ JavaScript
  return null;
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: any): boolean => {
  return (
    error?.response?.status === 401 ||
    error?.status === 401 ||
    error?.message?.includes("401") ||
    error?.message?.includes("Unauthorized")
  );
};

/**
 * Handle authentication error
 */
export const handleAuthError = (
  error: any,
  redirectUrl: string = "/cart"
): void => {
  if (isAuthError(error)) {
    toast.error("Phiên đăng nhập đã hết hạn.", {
      description: "Vui lòng đăng nhập lại.",
      duration: 3000,
    });

    setTimeout(() => {
      localStorage.removeItem("users");
      localStorage.removeItem("userDetail");
      localStorage.removeItem("userRole");

      window.location.href = `/login?redirect=${encodeURIComponent(
        redirectUrl
      )}`;
    }, 1000);
  }
};
