/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { isLocalhost } from "./env";
import { handleApiError } from "./api.error.handler";
import { logout } from "./local.storage";
import authService from "@/auth/services/auth.service";
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

const DEBUG = true; 
const debugLog = (title: string, data?: any) => {
  if (!DEBUG) return;
  console.log(
    `%c[AXIOS DEBUG] ${title}`,
    "color: #00bcd4; font-weight: bold",
    data || ""
  );
};

const debugError = (title: string, data?: any) => {
  if (!DEBUG) return;
  console.error(
    `%c[AXIOS ERROR] ${title}`,
    "color: #f44336; font-weight: bold",
    data || ""
  );
};

const debugSuccess = (title: string, data?: any) => {
  if (!DEBUG) return;
  console.log(
    `%c[AXIOS SUCCESS] ${title}`,
    "color: #4caf50; font-weight: bold",
    data || ""
  );
};

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Vẫn giữ true để support cookie ở môi trường khác
});

// Danh sách các endpoint KHÔNG cần gửi access token
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  // ... (giữ nguyên danh sách cũ)
  "/auth/logout",
];

const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

// ==================== REFRESH TOKEN LOCK MECHANISM ====================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// ==================== REQUEST INTERCEPTOR ====================
instance.interceptors.request.use(
  (config) => {
    const isPublic = isPublicEndpoint(config.url);

    // [UPDATE] Logic xử lý Localhost dùng localStorage
    if (isLocalhost() && !isPublic) {
      // Giả sử key bạn lưu là 'accessToken', sửa lại nếu tên khác
      const token = localStorage.getItem("accessToken"); 
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        debugLog("🔑 Đã gắn Token từ LocalStorage (Localhost Mode)");
      }
    }

    debugLog("📤 REQUEST INTERCEPTOR", {
      url: config.url,
      method: config.method,
      isPublic,
      isLocalhost: isLocalhost(),
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // ... (Giữ nguyên logic log success)
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // ... (Giữ nguyên logic xử lý blob error nếu cần)

    const errorCode = error.response?.data?.code;

    // ==================== XỬ LÝ 401 ====================
    const isAccessTokenExpired =
      error.response?.status === 401 &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest._retry;

    if (isAccessTokenExpired) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              // [UPDATE] Nếu là localhost, phải update lại header của request chờ
              if (isLocalhost()) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(instance(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        debugLog("🔄 Bắt đầu refresh token...");
        
        // [UPDATE] Lấy refresh token từ storage nếu là localhost
        let refreshTokenPayload = ""; 
        if (isLocalhost()) {
            refreshTokenPayload = localStorage.getItem("refreshToken") || "";
        }

        // Gọi API refresh
        // Lưu ý: authService.refreshToken phải trả về data chứa accessToken mới
        const res: any = await authService.refreshToken({ 
            refreshToken: refreshTokenPayload // Truyền string rỗng nếu dùng cookie, truyền value nếu dùng localStorage
        });
        
        // [UPDATE] QUAN TRỌNG: Lưu token mới vào localStorage nếu đang ở local
        const newAccessToken = res?.data?.accessToken || res?.accessToken; // Tuỳ cấu trúc response của bạn
        const newRefreshToken = res?.data?.refreshToken || res?.refreshToken;

        if (isLocalhost() && newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            if(newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
            
            // Set default header cho các request sau
            instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            // Update header cho request hiện tại đang retry
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            debugSuccess("💾 Đã lưu token mới vào LocalStorage");
        }

        processQueue(null, newAccessToken);

        return instance(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        
        // Logic logout giữ nguyên
        // logout(); 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as Promise<T>;
}

export default instance;