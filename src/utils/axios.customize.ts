/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/api/_types/api.types";
import authService from "@/auth/services/auth.service";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { isLocalhost } from "./env";
import { toast } from "sonner";
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

// --- DEBUG UTILS ---
const DEBUG = false;
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
  withCredentials: true,
});

// Log môi trường local/prod khi khởi tạo axios
if (typeof window !== "undefined") {
  if (isLocalhost()) {
    console.log("[AXIOS] Đang chạy ở LOCALHOST");
  } else {
    console.log("[AXIOS] Đang chạy ở PRODUCTION hoặc domain thật");
  }
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

// ==================== TRẠNG THÁI KHÓA (LOCK) ====================
let isLoggingOut = false; // Biến quan trọng nhất để chặn spam logout
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// Xử lý hàng đợi
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token || "");
    }
  });
  failedQueue = [];
};

// --- HÀM LOGOUT DUY NHẤT ---
// Chỉ cho phép chạy 1 lần nhờ biến isLoggingOut
const forceLogout = (title: string, description: string) => {
  if (isLoggingOut) return; // Nếu đang logout rồi thì DỪNG NGAY
  isLoggingOut = true; // Khóa lại

  // Hủy toàn bộ request đang chờ để tránh lỗi dây chuyền
  processQueue(new Error("Session expired, forcing logout..."));

  // Hiển thị thông báo 1 lần duy nhất
  toast.error(title, {
    description: description,
    duration: 4000,
  });

  // Đợi user đọc xong mới logout
  setTimeout(() => {
    logout();
    // Sau khi redirect/reload, trang web được tải lại nên isLoggingOut tự reset
  }, 2000);
};

// ==================== REQUEST INTERCEPTOR ====================
instance.interceptors.request.use(
  (config) => {
    // Nếu đang logout, treo request luôn, không cho gửi đi để tránh lỗi
    if (isLoggingOut) {
      return new Promise(() => {});
    }

    // Thêm log kiểm tra môi trường local/prod cho từng request
    if (typeof window !== "undefined" && isLocalhost()) {
      // Bạn có thể thêm logic đặc biệt cho local ở đây nếu muốn
      // console.log("[AXIOS][LOCAL] Request:", config.url);
    }

    const isPublic = isPublicEndpoint(config.url);

    // Xử lý warning query string (giữ nguyên code của bạn)
    if (config.url?.includes("/homepage/banners/active/by-page")) {
      if (config.url.includes("?") && config.params) {
        config.params = undefined;
      }
    }

    debugLog("📤 REQUEST INTERCEPTOR", {
      url: config.url,
      method: config.method,
      isPublic,
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
    // Nếu đang logout, chặn luôn response thành công (hiếm khi xảy ra nhưng để chắc chắn)
    if (isLoggingOut) return response;

    debugSuccess("✅ RESPONSE SUCCESS", {
      url: response.config.url,
      status: response.status,
    });

    if (
      response.config.responseType === "blob" ||
      response.data instanceof Blob
    ) {
      return response.data;
    }

    const apiResponse = response.data as ApiResponse<any>;
    if (
      apiResponse &&
      typeof apiResponse === "object" &&
      apiResponse.code &&
      apiResponse.code !== 1000
    ) {
      debugLog("⚠️ Response có error code", {
        code: apiResponse.code,
        message: apiResponse.message,
      });
    }

    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // ⛔ CHỐT CHẶN QUAN TRỌNG: Nếu đang logout, hủy mọi xử lý lỗi tiếp theo
    if (isLoggingOut) {
      return new Promise(() => {}); // Trả về promise treo để không báo lỗi ra UI
    }

    console.log("🚨 RESPONSE ERROR", error?.response?.status);

    // Xử lý lỗi Blob (giữ nguyên logic của bạn)
    if (
      error.config?.responseType === "blob" &&
      error.response?.data instanceof Blob
    ) {
      try {
        const text = await error.response.data.text();
        const errorData = JSON.parse(text);
        const customError = new Error(
          errorData.message || "Lỗi không xác định"
        );
        (customError as any).response = { ...error.response, data: errorData };
        return Promise.reject(customError);
      } catch {
        // ignore
      }
    }

    // --- XỬ LÝ 401 (TOKEN HẾT HẠN) ---
    const isAccessTokenExpired =
      error.response?.status === 401 &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest._retry;

    if (isAccessTokenExpired) {
      if (isRefreshing) {
        // Nếu đang có request khác refresh, xếp hàng chờ
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(instance(originalRequest)),
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
       // Lấy refreshToken từ localStorage/cookie
const refreshToken = localStorage.getItem("refreshToken") || ""; // hoặc lấy từ cookie nếu backend lưu ở đó
await authService.refreshToken({ refreshToken });
        console.log("✅ Refresh token thành công");

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-token-refreshed"));
        }

        // Xả hàng đợi
        processQueue(null, "success");

        // Retry request gốc
        return instance(originalRequest);
      } catch (refreshError: any) {
        // --- REFRESH THẤT BẠI ---
        console.log("❌ Refresh token thất bại", refreshError);
        
        // Hủy các request đang chờ
        processQueue(refreshError, null);

        const refreshCode = refreshError?.response?.data?.code;
        const refreshStatus = refreshError?.response?.status;

        // Kiểm tra nguyên nhân lỗi để thông báo
        const isExpired = refreshStatus === 401 || refreshCode === 2011;

        if (isExpired) {
          // Gọi hàm forceLogout (nó đã có cơ chế chặn spam)
          forceLogout(
            "Phiên đăng nhập hết hạn",
            "Vui lòng đăng nhập lại để tiếp tục sử dụng."
          );
        } else {
          // Các lỗi khác (500, Network Error...) cũng logout để an toàn
          forceLogout(
            "Lỗi xác thực",
            "Không thể làm mới phiên đăng nhập. Vui lòng đăng nhập lại."
          );
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Transform lỗi thông thường
    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as Promise<T>;
}

export default instance;