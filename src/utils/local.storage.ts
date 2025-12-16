/* eslint-disable @typescript-eslint/no-explicit-any */
// Giữ lại dòng này vì có thể có tương tác với các thư viện khác trả về 'any'

// ==================== IMPORTS ====================

// ✅ Dùng toast từ Sonner thay thế Antd notification
import { toast } from "sonner";
import {authService} from "@/auth/services/auth.service";
import { ApiResponse } from "@/api/_types/api.types";
// ==================== COOKIE & CACHE UTILITIES ====================

/**
 * Helper function để lấy cookie value (Sử dụng regex tối ưu)
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
};

/**
 * Quick check authentication status bằng cookie isLoggedIn
 * @returns true nếu isLoggedIn cookie = "true", false nếu không
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const isLoggedIn = getCookie("isLoggedIn");
  return isLoggedIn === "true";
};

/**
 * Lấy user từ localStorage (Tạm thời, chỉ dùng để hiển thị UI)
 */
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
 * Clear user data from localStorage (Đồng bộ hóa với việc xóa cookies)
 */
export const clearTokens = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("users");
  localStorage.removeItem("userDetail");
  localStorage.removeItem("userRole");
  
  sessionStorage.removeItem("checkoutPreview");
  sessionStorage.removeItem("checkoutRequest");
};

// ==================== REDIRECT & LOGOUT LOGIC ====================

/**
 * Helper function để redirect đến trang login phù hợp
 */
const redirectToLogin = (pathname?: string): void => {
  if (typeof window === "undefined") return;
  
  let loginPath = "/login";
  if (pathname?.startsWith("/shop")) {
    loginPath = "/shop/login";
  } else if (pathname?.startsWith("/employee") || pathname?.startsWith("/manager")) {
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

/**
 * HỢP NHẤT LOGOUT: Hàm logout chính, có thể chỉ định đường dẫn redirect
 * ✅ Thay thế 3 hàm logout cũ bằng hàm này.
 */
const REDIRECT_MAP: Record<string, string> = {
    employee: "/employee/login",
    shop: "/shop/login",
    default: "/",
};

export const logout = async (context: 'default' | 'employee' | 'shop' = 'default'): Promise<void> => {
  if (typeof window === "undefined") return;

  const redirectPath = REDIRECT_MAP[context] || REDIRECT_MAP.default;
  
  console.log(`🚪 Logout function called, context: ${context}, redirecting to: ${redirectPath}`);

  try {
    // Gọi API logout - Backend đọc refreshToken từ cookies và clear cookies
    await authService.logout({ refreshToken: "" });
    console.log("✅ Backend logout successful - cookies cleared");
  } catch (error) {
    console.error("❌ Backend logout failed, continuing frontend clear:", error);
  }

  // ✅ Redirect trước (ngay lập tức)
  window.location.href = redirectPath;

  // ✅ Clear localStorage sau khi redirect (chạy ngay sau redirect)
  clearTokens();
  console.log("✅ All user data cleared");
};

// Export các hàm cũ để giữ compatibility
export const logoutEmployee = (): Promise<void> => logout('employee');
export const logoutShop = (): Promise<void> => logout('shop');


// ==================== AUTH VERIFICATION FLOW ====================

interface VerifyAuthOptions {
  redirectOnFailure?: boolean;
  pathname?: string;
}

interface VerifyAuthResult<T> {
  authenticated: boolean;
  user: T | null;
}

/**
 * Verify authentication bằng cách gọi API /me với logic refresh token
 * @returns Promise với authenticated status và user data
 */
export const verifyAuth = async (options?: VerifyAuthOptions): Promise<VerifyAuthResult<any>> => {
  const { redirectOnFailure = false, pathname } = options || {};

  // Step 1: Check cookie flag (NHANH)
  if (!isAuthenticated()) {
    clearTokens();
    if (redirectOnFailure) {
      redirectToLogin(pathname);
    }
    return { authenticated: false, user: null };
  }

  try {
    // Step 2: Call /me (Axios Interceptor xử lý refresh token và retry)
    const response: ApiResponse<any> = await authService.getCurrentUser();
    
    if (response?.success && response?.data) {
      // Step 3: 200 OK - Cập nhật localStorage
      localStorage.setItem("users", JSON.stringify(response.data));
      return { authenticated: true, user: response.data };
    } else {
      // ❌ Không có data - Xóa localStorage và cookie flag
      clearTokens();
      if (redirectOnFailure) {
        redirectToLogin(pathname);
      }
      return { authenticated: false, user: null };
    }
  } catch (error: any) {
    // Step 4: Error từ /me (Lỗi sau khi Interceptor đã retry: Refresh token hết hạn)
    const is401 = error?.response?.status === 401 || error?.code === 401;
    const isRefreshTokenExpired = error?.response?.data?.code === 2011; 
    
    console.error("❌ Auth verification failed:", {
      status: error?.response?.status,
      code: error?.response?.data?.code,
    });
    
    // Xử lý thông báo và redirect nếu refresh token hết hạn
    if ((is401 || isRefreshTokenExpired) && redirectOnFailure) {
      // ✅ SỬ DỤNG SONNER TOAST STATIC METHOD (Thay thế Antd notification)
      toast.error(
        "Phiên đăng nhập đã hết hạn",
        {
          description: "Vui lòng đăng nhập lại để tiếp tục sử dụng.",
          duration: 5000,
        }
      );
      
      // Xóa tokens và chuyển hướng
      clearTokens();
      redirectToLogin(pathname);
    } else {
        // Chỉ xóa tokens nếu lỗi khác (ví dụ: Network/Server Error, không phải 401)
        clearTokens();
    }
    
    return { authenticated: false, user: null };
  }
};