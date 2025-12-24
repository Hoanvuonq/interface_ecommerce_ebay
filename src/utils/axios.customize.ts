/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/api/_types/api.types";
import authService from "@/auth/services/auth.service";
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { isLocalhost } from "./env";
import { toast } from "sonner";
import { handleApiError } from "./api.error.handler";
import { logout } from "./local.storage";

// Mở rộng type cho Axios config
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

// --- DEBUG UTILS ---
const DEBUG = false; // Bật true khi cần debug
const debugLog = (title: string, data?: any) => {
  if (!DEBUG) return;
  console.log(`%c[AXIOS DEBUG] ${title}`, "color: #00bcd4; font-weight: bold", data || "");
};

const debugSuccess = (title: string, data?: any) => {
  if (!DEBUG) return;
  console.log(`%c[AXIOS SUCCESS] ${title}`, "color: #4caf50; font-weight: bold", data || "");
};

// Khởi tạo instance
const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Quan trọng: Luôn true để Cookie hoạt động ở Prod
});

// Log môi trường khi khởi động
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

// ==================== QUẢN LÝ HÀNG ĐỢI REFRESH ====================
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

// --- HÀM FORCE LOGOUT ---
const forceLogout = (title: string, description: string) => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  processQueue(new Error("Session expired, logging out..."));

  toast.error(title, { description, duration: 4000 });

  setTimeout(() => {
    logout(); // Hàm clear storage và redirect
  }, 1500);
};

// ==================== REQUEST INTERCEPTOR ====================
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Chặn request nếu đang logout
    if (isLoggingOut) {
      return new Promise(() => {}); 
    }

    const isPublic = isPublicEndpoint(config.url);

    // --- [LOGIC QUAN TRỌNG] Xử lý Token theo môi trường ---
    if (typeof window !== "undefined") {
      if (isLocalhost()) {
        // Localhost: Lấy token từ Storage gắn vào Header
        const token = localStorage.getItem("accessToken");
        // Chỉ gắn nếu có token VÀ không phải là request refresh (tránh loop)
        if (token && !config.url?.includes("/auth/refresh")) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        // Production: Cookie tự động gửi, xóa Authorization header để tránh xung đột
        // (Trừ khi API của bạn yêu cầu cả 2, nhưng thường là không)
        if (config.headers.Authorization) {
            delete config.headers.Authorization;
        }
      }
    }
    // -----------------------------------------------------

    // Fix lỗi query string của antd table (nếu có)
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

// ==================== RESPONSE INTERCEPTOR ====================
instance.interceptors.response.use(
  (response: AxiosResponse): any => {
    if (isLoggingOut) return response;

    debugSuccess("✅ RESPONSE", { url: response.config.url, status: response.status });

    // Trả về Blob nếu cần
    if (response.config.responseType === "blob" || response.data instanceof Blob) {
      return response.data;
    }

    // Unwrap response data (Giả định cấu trúc ApiResponse)
    const apiResponse = response.data as ApiResponse<any>;
    // Nếu backend trả về code business error (ví dụ code != 1000) nhưng status 200
    if (apiResponse?.code && apiResponse.code !== 1000) {
       debugLog("⚠️ Business Error Code", { code: apiResponse.code, msg: apiResponse.message });
    }

    return response.data;
  },
  async (error: any) => {
    const originalRequest = error.config;

    if (isLoggingOut) return new Promise(() => {});

    // Xử lý lỗi Blob (chuyển blob thành text để đọc lỗi)
    if (error.config?.responseType === "blob" && error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const errorData = JSON.parse(text);
        const customError = new Error(errorData.message || "Lỗi không xác định");
        (customError as any).response = { ...error.response, data: errorData };
        return Promise.reject(customError);
      } catch {}
    }

    // --- XỬ LÝ 401: REFRESH TOKEN ---
    const isUnauthorized = error.response?.status === 401;
    const isRefreshUrl = originalRequest.url.includes("/auth/refresh");

    // Chỉ refresh nếu lỗi 401 VÀ không phải là chính request refresh bị lỗi VÀ chưa retry
    if (isUnauthorized && !isRefreshUrl && !originalRequest._retry) {
      
      if (isRefreshing) {
        // Nếu đang có tiến trình refresh khác, xếp hàng chờ
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
        
        // Chỉ lấy refresh token từ storage nếu ở Localhost
        if (isLocalhost()) {
            refreshTokenPayload = localStorage.getItem("refreshToken") || "";
        }
        // Ở Prod, refresh token nằm trong HttpOnly Cookie, gửi request rỗng hoặc body tuỳ backend

        // 1. Gọi API Refresh
        const res: any = await authService.refreshToken({ refreshToken: refreshTokenPayload });
        
        // 2. Xử lý kết quả thành công
        // Cần kiểm tra cấu trúc trả về của authService.refreshToken (thường đã được unwrap .data bởi response interceptor)
        const newAccessToken = res?.data?.accessToken || res?.accessToken;

        if (isLocalhost()) {
            if (!newAccessToken) throw new Error("Không nhận được accessToken mới");
            
            // Lưu token mới
            localStorage.setItem("accessToken", newAccessToken);
            if (res?.data?.refreshToken) {
                localStorage.setItem("refreshToken", res.data.refreshToken);
            }
            
            // Gắn header cho request cũ để gọi lại
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            console.log("✅ [Local] Refreshed Token Success");
        } else {
            console.log("✅ [Prod] Refreshed Cookie Success");
        }

        // Bắn event cho các tab khác (nếu cần)
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-token-refreshed"));
        }

        // Xử lý hàng đợi đang chờ
        processQueue(null, newAccessToken);

        // Gọi lại request ban đầu
        return instance(originalRequest);

      } catch (refreshError: any) {
        // --- XỬ LÝ KHI REFRESH THẤT BẠI ---
        console.error("❌ Refresh Failed:", refreshError);
        processQueue(refreshError, null);
        
        const refreshStatus = refreshError?.response?.status;
        const refreshCode = refreshError?.response?.data?.code;

        // Nếu Refresh cũng bị 401 hoặc lỗi nghiệp vụ Token hết hạn -> Logout
        if (refreshStatus === 401 || refreshCode === 2011) {
            forceLogout("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
        } else {
            // Các lỗi mạng khác hoặc 500 thì không logout ngay, nhưng vẫn reject
            // Tuỳ logic, ở đây mình logout luôn cho an toàn
            forceLogout("Lỗi xác thực", "Không thể làm mới phiên. Vui lòng đăng nhập lại.");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý lỗi thông thường (không phải 401 hoặc đã retry)
    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as Promise<T>;
}

export default instance;