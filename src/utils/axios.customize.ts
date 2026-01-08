/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/api/_types/api.types";
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

// --- HÀM LOGOUT CƯỠNG CHẾ (ĐÃ FIX UX) ---
const forceLogout = (title: string, description: string) => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  
  // Hủy các request đang chờ
  processQueue(new Error("Session expired"));

  // Bắn event để hiển thị thông báo lỗi
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("axios-force-logout", {
        detail: { title, description }
    }));
  }

  // Xóa token
  logout(); 
  if (typeof window !== "undefined" && isLocalhost()) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
  }

  // Chuyển hướng về Login sau 1s
  setTimeout(() => {
    if (typeof window !== "undefined") {
        // Lấy đường dẫn hiện tại user đang đứng
        const currentPath = window.location.pathname + window.location.search;
        
        // Nếu đang ở trang login rồi thì không cần redirect nữa
        if (currentPath.startsWith("/login")) return;

        // Redirect về login kèm theo ?callbackUrl=... để sau khi login xong quay lại đúng trang này
        window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`; 
    }
  }, 1000);
};

// --- 3. HELPER REFRESH TOKEN ---
const performRefreshToken = async () => {
    const refreshTokenPayload = isLocalhost() ? localStorage.getItem("refreshToken") : null;
    
    if (isLocalhost() && !refreshTokenPayload) {
        throw new Error("No refresh token available");
    }

    const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken: refreshTokenPayload },
        { withCredentials: true }
    );
    return response.data;
};

// --- 4. REQUEST INTERCEPTOR ---
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isLoggingOut) {
       return Promise.reject(new Error("Logging out...")); 
    }

    if (typeof window !== "undefined" && isLocalhost()) {
      const token = localStorage.getItem("accessToken");
      if (token && !config.url?.includes("/auth/refresh")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.url?.includes("/homepage/banners/active/by-page")) {
      if (config.url.includes("?") && config.params) {
        config.params = undefined;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- 5. RESPONSE INTERCEPTOR ---
instance.interceptors.response.use(
  (response: AxiosResponse): any => {
    if (response.config.responseType === "blob" || response.data instanceof Blob) {
      return response.data;
    }
    return response.data;
  },
  async (error: any) => {
    const originalRequest = error.config;

    if (isLoggingOut) return Promise.reject(error);

    // Xử lý lỗi Blob
    if (error.config?.responseType === "blob" && error.response?.data instanceof Blob) {
        try {
            const text = await error.response.data.text();
            const errorData = JSON.parse(text);
            error.response.data = errorData;
        } catch {}
    }

    const status = error.response?.status;
    const msg = error.response?.data?.message || "";

    // Nếu lỗi ngay tại API refresh token -> Logout ngay
    if (originalRequest.url?.includes("/auth/refresh")) {
        forceLogout("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại (Refresh Failed).");
        return Promise.reject(error);
    }

    // Logic Refresh Token khi gặp 401
    if (status === 401 && !originalRequest._retry) {
      
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

        if (isLocalhost()) {
            if (!newAccessToken) throw new Error("Không nhận được accessToken mới");
            localStorage.setItem("accessToken", newAccessToken);
            if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
            
            instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-token-refreshed"));
        }

        processQueue(null, newAccessToken);
        return instance(originalRequest);

      } catch (refreshError: any) {
        processQueue(refreshError, null);
        
        const errMsg = refreshError?.response?.data?.message || "";
        
        // Bắt lỗi cụ thể
        if (refreshError?.response?.status === 401 || errMsg.includes("Token không hợp lệ")) {
            forceLogout("Phiên đăng nhập hết hạn", "Token không hợp lệ. Vui lòng đăng nhập lại.");
        } else {
            forceLogout("Lỗi xác thực", "Không thể làm mới phiên.");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // NẾU KHÔNG PHẢI LỖI 401 (VD: 404 Not Found, 500 Server Error)
    // Code xử lý ở component sẽ nhận được error này
    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as Promise<T>;
}

export default instance;