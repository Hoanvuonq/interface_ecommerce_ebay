/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { isLocalhost } from "./env";
import { handleApiError } from "./api.error.handler";
import { logout } from "./local.storage";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://raising-latina-candy-ribbon.trycloudflare.com") + "/api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isLoggingOut = false;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * HÀM CHUYỂN HƯỚNG VỀ LOGIN
 * Fix lỗi: Xử lý redirect chuẩn xác và lưu lại trang cũ để quay lại (callbackUrl)
 */
const forceLogout = (title: string, description: string) => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  // Hủy hàng đợi request
  processQueue(new Error("Session expired"));

  // Dispatch thông báo lỗi (cho Toast/Notification component lắng nghe)
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("axios-force-logout", {
        detail: { title, description },
      })
    );

    // Xóa Token trong LocalStorage (nếu ở Local) hoặc Cookies (qua hàm logout)
    logout();
    if (isLocalhost()) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    // Lấy URL hiện tại để quay lại sau khi login
    const currentPath = window.location.pathname + window.location.search;
    
    // Nếu không phải đang ở trang login thì mới redirect
    if (!currentPath.includes("/login")) {
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
      
      // Chuyển hướng ngay lập tức hoặc sau 1 khoảng trễ ngắn để user kịp thấy thông báo
      setTimeout(() => {
        window.location.href = loginUrl;
      }, 500);
    }
  }
};

const performRefreshToken = async () => {
  const refreshTokenPayload = isLocalhost() ? localStorage.getItem("refreshToken") : null;

  // Gọi API refresh bằng instance axios gốc (không dùng interceptor này để tránh loop)
  const response = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken: refreshTokenPayload },
    { withCredentials: true }
  );
  return response.data;
};

// --- REQUEST INTERCEPTOR ---
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isLoggingOut) {
      return Promise.reject(new Error("Session expired. Redirecting to login..."));
    }

    if (typeof window !== "undefined" && isLocalhost()) {
      const token = localStorage.getItem("accessToken");
      if (token && !config.url?.includes("/auth/refresh")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
instance.interceptors.response.use(
  (response: AxiosResponse): any => {
    return response.data;
  },
  async (error: any) => {
    const originalRequest = error.config;
    if (!originalRequest || isLoggingOut) return Promise.reject(error);

    const status = error.response?.status;
    const errorData = error.response?.data;

    // 1. Nếu lỗi tại chính API refresh token -> Logout ngay không bàn cãi
    if (originalRequest.url?.includes("/auth/refresh")) {
      forceLogout("Hết hạn phiên làm việc", "Vui lòng đăng nhập lại.");
      return Promise.reject(error);
    }

    // 2. Xử lý lỗi 401 (Unauthorized)
    if (status === 401 && !originalRequest._retry) {
      // Nếu đang trong quá trình refresh, đẩy request này vào hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken) => {
              if (isLocalhost() && newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              resolve(instance(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data: any = await performRefreshToken();
        const newAccessToken = data?.result?.accessToken || data?.data?.accessToken || data?.accessToken;
        const newRefreshToken = data?.result?.refreshToken || data?.data?.refreshToken;

        if (!newAccessToken) throw new Error("Refresh failed");

        if (isLocalhost()) {
          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
        }

        instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return instance(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        forceLogout("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại để tiếp tục.");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const isAuthError = 
        errorData?.errorCode === "TOKEN_INVALID" || 
        errorData?.message?.includes("xác thực") ||
        errorData?.message?.includes("unauthorized");

    if (status === 403 && isAuthError) {
        forceLogout("Lỗi xác thực", "Tài khoản của bạn không có quyền hoặc phiên đã lỗi.");
        return Promise.reject(error);
    }

    return Promise.reject(handleApiError(error));
  }
);

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as Promise<T>;
}

export default instance;