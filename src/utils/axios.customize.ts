import { ApiResponse } from "@/api/_types/api.types";
import authService from "@/auth/services/auth.service";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
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

// 🔍 Debug Utility
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

// const IS_BROWSER = typeof window !== "undefined" && typeof localStorage !== "undefined";

const plainAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

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

/**
 * Kiểm tra xem endpoint có phải là public (không cần token) không
 */
const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

// ==================== REFRESH TOKEN LOCK MECHANISM ====================
let isRefreshing = false; // Flag để track có đang refresh token không
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = []; // Queue chứa các requests đang chờ token mới

// Xử lý queue khi refresh thành công
const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      // ✅ Refresh thành công - resolve tất cả requests trong queue
      // Token không cần thiết vì resolve function tự retry request với token mới từ cookies
      promise.resolve(token || "");
    }
  });
  failedQueue = [];
};

// ==================== REQUEST INTERCEPTOR ====================
instance.interceptors.request.use(
  (config) => {
    const isPublic = isPublicEndpoint(config.url);

    // Debug: Xử lý cảnh báo params và URL có query string
    if (config.url?.includes('/homepage/banners/active/by-page')) {
      if (config.url.includes('?') && config.params) {
        console.warn('[AXIOS INTERCEPTOR] WARNING: URL đã có query string nhưng vẫn có params object!', {
          url: config.url,
          params: config.params,
        });
        // Xóa params để tránh axios merge
        config.params = undefined;
      }
    }

    debugLog("📤 REQUEST INTERCEPTOR", {
      url: config.url,
      method: config.method,
      isPublic,
      params: config.params, // Log params để debug
    });

    if (isPublic) {
      debugLog("⚪ Public endpoint");
    } else {
      debugLog("🔐 Protected endpoint - Backend sẽ đọc token từ cookies");
    }

    return config;
  },
  (error) => {
    debugError("❌ REQUEST ERROR", error);
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    debugSuccess("✅ RESPONSE SUCCESS", {
      url: response.config.url,
      status: response.status,
    });

    if (response.config.responseType === 'blob' || response.data instanceof Blob) {
      return response.data;
    }

    // Kiểm tra response có error code không (backend trả error nhưng HTTP 200)
    const apiResponse = response.data as ApiResponse<any>;
    if (apiResponse && typeof apiResponse === 'object' && apiResponse.code && apiResponse.code !== 1000) {
      debugLog("⚠️ Response có error code", {
        code: apiResponse.code,
        message: apiResponse.message,
      });
    }

    return response.data;
  },
  async (error) => {
    console.log("🚨 RESPONSE ERROR", error);
    debugError("📥 RESPONSE ERROR", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      errorCode: error.response?.data?.code,
    });

    const originalRequest = error.config;

    // Xử lý lỗi khi response là blob (file download)
    if (error.config?.responseType === 'blob' && error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const errorData = JSON.parse(text);
        // Tạo error mới với message từ JSON
        const customError = new Error(errorData.message || 'Lỗi không xác định');
        (customError as any).response = {
          ...error.response,
          data: errorData,
        };
        return Promise.reject(customError);
      } catch {
        // Không phải JSON, trả về error gốc
      }
    }

    // Lấy error code từ response
    const errorCode = error.response?.data?.code;

    // ==================== XỬ LÝ 401 - ACCESS TOKEN HẾT HẠN ====================
    const isAccessTokenExpired =
      error.response?.status === 401 &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest._retry; // Tránh infinite retry loop

    if (isAccessTokenExpired) {
      debugLog(
        "🔄 Phát hiện AccessToken hết hạn (401) - Bắt đầu refresh token...",
        {
          status: error.response?.status,
          errorCode: errorCode,
        }
      );

      // Đánh dấu request này đã được retry
      originalRequest._retry = true;

      // ===== QUEUE MECHANISM: Nếu đang refresh, queue request này =====
      if (isRefreshing) {
        debugLog("⏳ Đã có process đang refresh token, thêm vào queue...");
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              debugLog("✅ Nhận token mới từ queue, retry request", {
                url: originalRequest.url,
              });
              // Retry request gốc
              resolve(instance(originalRequest));
            },
            reject: (err: any) => {
              debugError("❌ Queue rejected", { url: originalRequest.url });
              reject(err);
            },
          });
        });
      }

      // ===== BẮT ĐẦU REFRESH TOKEN =====
      debugLog("🔄 Bắt đầu gọi API refresh token...");
      isRefreshing = true;

      try {
        // Gọi API refresh token - Backend tự đọc refreshToken từ cookies
        await authService.refreshToken({ refreshToken: "" });
        console.log("✅ Refresh token thành công - Đang retry request gốc...");

        debugSuccess("✅ Refresh token THÀNH CÔNG! Backend đã set cookies mới");

        // 🔔 Thông báo toàn app (bao gồm WebSocketProvider) rằng accessToken đã được làm mới
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-token-refreshed"));
        }

        // ===== NOTIFY TẤT CẢ REQUESTS ĐANG CHỜ =====
        debugLog("📢 Notify tất cả requests trong queue...");
        processQueue(null, "success");

        // ✅ Retry request gốc với token mới
        // Request sẽ được retry với cùng data, user không mất dữ liệu đã nhập
        debugLog("🔄 Retry request gốc với token mới", {
          url: originalRequest.url,
          method: originalRequest.method,
        });

        // Retry request gốc - data vẫn được giữ nguyên
        return instance(originalRequest);
      } catch (refreshError: any) {
        console.log("refreshError", refreshError);
        debugError("❌ Refresh token THẤT BẠI", {
          status: refreshError?.response?.status,
          message: refreshError?.message,
          errorCode: refreshError?.response?.data?.code,
        });

        // Notify tất cả requests trong queue về lỗi
        processQueue(refreshError, null);

        // Kiểm tra nếu refresh token cũng hết hạn
        // Backend trả về: HTTP 401 hoặc error code 2011 (REFRESH_TOKEN_EXPIRED)
        const refreshErrorCode = refreshError?.response?.data?.code;
        const refreshErrorStatus = refreshError?.response?.status;

        const isRefreshTokenExpired =
          refreshErrorStatus === 401 ||
          refreshErrorCode === 2011; // REFRESH_TOKEN_EXPIRED

        if (isRefreshTokenExpired) {
          debugError("⚠️ Refresh token đã hết hạn (401 hoặc code 2011) - LOGOUT!");
          console.log("Refresh token đã hết hạn - LOGOUT!");

         toast.error("Phiên đăng nhập đã hết hạn", {
            description: "Vui lòng đăng nhập lại để tiếp tục sử dụng.",
            duration: 5000,
          });

          setTimeout(() => {
            logout();
          }, 2000); // Delay để user kịp đọc notification

          return Promise.reject(refreshError);
        }

        debugError("⚠️ Refresh token thất bại với lỗi khác - LOGOUT!");
        
        toast.error("Lỗi xác thực", {
          description: "Không thể làm mới phiên đăng nhập. Vui lòng đăng nhập lại.",
          duration: 5000,
        });

        setTimeout(() => {
          logout();
        }, 2000);

        return Promise.reject(refreshError);
      } finally {
        // Reset flag
        isRefreshing = false;
      }
    }

    // ✅ Transform error sang ApiError trước khi reject
    const apiError = handleApiError(error);

    // Log chi tiết error với error code
    if (process.env.NODE_ENV === "development") {
      // console.error("🚨 API Error Detail:", {
      //   code: apiError.code,
      //   message: apiError.message,
      //   url: error.config?.url,
      //   method: error.config?.method,
      //   status: error.response?.status,
      // });
    }

    return Promise.reject(apiError);
  }
);

/**
 * Hàm wrapper cho request
 * @param config Cấu hình Axios
 * @returns Promise<T>
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  return instance(config) as Promise<T>;
}

export default instance;