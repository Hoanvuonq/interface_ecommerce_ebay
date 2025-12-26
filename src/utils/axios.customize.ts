/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/api/_types/api.types";
import authService from "@/auth/services/auth.service";
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { isLocalhost } from "./env";
import { useToast } from "@/hooks/useToast";
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

const DEBUG = false; const debugLog = (title: string, data?: any) => {
  if (!DEBUG) return;
  console.log(`%c[AXIOS DEBUG] ${title}`, "color: #00bcd4; font-weight: bold", data || "");
};

const debugSuccess = (title: string, data?: any) => {
  if (!DEBUG) return;
  console.log(`%c[AXIOS SUCCESS] ${title}`, "color: #4caf50; font-weight: bold", data || "");
};

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

if (typeof window !== "undefined") {
  console.log(
    isLocalhost()
      ? "[AXIOS] Mode: LOCALHOST (Bearer Token)"
      : "[AXIOS] Mode: PRODUCTION (HttpOnly Cookie)"
  );
}

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/otp/verify",
  "/auth/otp/resend",
  "/auth/password/forgot",
  "/auth/password/verify",
  "/auth/password/reset",
  "/users/exists/email",
  "/users/exists/username",
  "/auth/logout",
];

const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

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

const forceLogout = (title: string, description: string) => {
  if (isLoggingOut) return;
  isLoggingOut = true;
const { error } = useToast();
  processQueue(new Error("Session expired, logging out..."));

  error(title, { description, duration: 4000 });

  setTimeout(() => {
    logout();
  }, 1500);
};

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isLoggingOut) {
      return new Promise(() => {}); 
    }
    const isPublic = isPublicEndpoint(config.url);

    if (typeof window !== "undefined") {
      if (isLocalhost()) {
        const token = localStorage.getItem("accessToken");
        if (token && !config.url?.includes("/auth/refresh")) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        if (config.headers.Authorization) {
            delete config.headers.Authorization;
        }
      }
    }

    if (config.url?.includes("/homepage/banners/active/by-page")) {
      if (config.url.includes("?") && config.params) {
        config.params = undefined;
      }
    }

    debugLog("📤 REQUEST", { url: config.url, method: config.method, isPublic });
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response: AxiosResponse): any => {
    if (isLoggingOut) return response;

    debugSuccess("✅ RESPONSE", { url: response.config.url, status: response.status });

    if (response.config.responseType === "blob" || response.data instanceof Blob) {
      return response.data;
    }

    const apiResponse = response.data as ApiResponse<any>;
    if (apiResponse?.code && apiResponse.code !== 1000) {
       debugLog("⚠️ Business Error Code", { code: apiResponse.code, msg: apiResponse.message });
    }

    return response.data;
  },
  async (error: any) => {
    const originalRequest = error.config;

    if (isLoggingOut) return new Promise(() => {});

    if (error.config?.responseType === "blob" && error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const errorData = JSON.parse(text);
        const customError = new Error(errorData.message || "Lỗi không xác định");
        (customError as any).response = { ...error.response, data: errorData };
        return Promise.reject(customError);
      } catch {}
    }

    const isUnauthorized = error.response?.status === 401;
    const isRefreshUrl = originalRequest.url.includes("/auth/refresh");

    if (isUnauthorized && !isRefreshUrl && !originalRequest._retry) {
      
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
        let refreshTokenPayload = "";
        if (isLocalhost()) {
            refreshTokenPayload = localStorage.getItem("refreshToken") || "";
        }

        const res: any = await authService.refreshToken({ refreshToken: refreshTokenPayload });
        
        const newAccessToken = res?.data?.accessToken || res?.accessToken;

        if (isLocalhost()) {
            if (!newAccessToken) throw new Error("Không nhận được accessToken mới");
            
            localStorage.setItem("accessToken", newAccessToken);
            if (res?.data?.refreshToken) {
                localStorage.setItem("refreshToken", res.data.refreshToken);
            }
            
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        } else {
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-token-refreshed"));
        }

        processQueue(null, newAccessToken);
        return instance(originalRequest);

      } catch (refreshError: any) {
        console.error("❌ Refresh Failed:", refreshError);
        processQueue(refreshError, null);
        
        const refreshStatus = refreshError?.response?.status;
        const refreshCode = refreshError?.response?.data?.code;
        if (refreshStatus === 401 || refreshCode === 2011) {
            forceLogout("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
        } else {
            forceLogout("Lỗi xác thực", "Không thể làm mới phiên. Vui lòng đăng nhập lại.");
        }

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