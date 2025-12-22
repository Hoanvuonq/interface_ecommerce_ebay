/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiErrorResponse } from "@/api/_types/api.types";
import { ERROR_CODES, getErrorMessageByCode } from "@/constants/error.codes";
import { toast } from "sonner"; 

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  code: number;
  originalError?: any;
  response?: ApiErrorResponse;

  constructor(
    code: number,
    message: string,
    originalError?: any,
    response?: ApiErrorResponse
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.originalError = originalError;
    this.response = response;
  }
}

/**
 * Extract error info từ axios error
 */
export function extractErrorInfo(error: any): {
  code: number;
  message: string;
  response?: ApiErrorResponse;
} {
  // Nếu là AxiosError và có response từ backend
  if (error.response?.data) {
    const errorData = error.response.data as ApiErrorResponse;

    // Backend trả về error với code và message
    if (errorData.code && errorData.message) {
      return {
        code: errorData.code,
        message: errorData.message,
        response: errorData,
      };
    }
  }

  // Xử lý các trường hợp đặc biệt
  if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
    return {
      code: ERROR_CODES.GATEWAY_TIMEOUT.code,
      message: ERROR_CODES.GATEWAY_TIMEOUT.message,
    };
  }

  if (
    error.code === "ERR_NETWORK" ||
    error.message?.includes("Network Error")
  ) {
    return {
      code: ERROR_CODES.SERVICE_UNAVAILABLE.code,
      message: ERROR_CODES.SERVICE_UNAVAILABLE.message,
    };
  }

  // HTTP Status code mapping
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return {
          code: ERROR_CODES.INVALID_REQUEST.code,
          message:
            error.response?.data?.message ||
            ERROR_CODES.INVALID_REQUEST.message,
        };
      case 401:
        return {
          code: ERROR_CODES.UNAUTHORIZED.code,
          message:
            error.response?.data?.message || ERROR_CODES.UNAUTHORIZED.message,
        };
      case 403:
        return {
          code: ERROR_CODES.FORBIDDEN.code,
          message:
            error.response?.data?.message || ERROR_CODES.FORBIDDEN.message,
        };
      case 404:
        return {
          code: ERROR_CODES.RESOURCE_NOT_FOUND.code,
          message:
            error.response?.data?.message ||
            ERROR_CODES.RESOURCE_NOT_FOUND.message,
        };
      case 409:
        return {
          code: ERROR_CODES.RESOURCE_CONFLICT.code,
          message:
            error.response?.data?.message ||
            ERROR_CODES.RESOURCE_CONFLICT.message,
        };
      case 429:
        return {
          code: ERROR_CODES.RATE_LIMIT_EXCEEDED.code,
          message: ERROR_CODES.RATE_LIMIT_EXCEEDED.message,
        };
      case 500:
        return {
          code: ERROR_CODES.SERVER_ERROR.code,
          message: ERROR_CODES.SERVER_ERROR.message,
        };
      case 502:
      case 503:
        return {
          code: ERROR_CODES.SERVICE_UNAVAILABLE.code,
          message: ERROR_CODES.SERVICE_UNAVAILABLE.message,
        };
      case 504:
        return {
          code: ERROR_CODES.GATEWAY_TIMEOUT.code,
          message: ERROR_CODES.GATEWAY_TIMEOUT.message,
        };
    }
  }

  // Default unknown error
  return {
    code: ERROR_CODES.UNKNOWN_ERROR.code,
    message: error.message || ERROR_CODES.UNKNOWN_ERROR.message,
  };
}

/**
 * Handle API Error - tạo ApiError object từ error bất kỳ
 */
export function handleApiError(error: any): ApiError {
  const { code, message, response } = extractErrorInfo(error);
  return new ApiError(code, message, error, response);
}

/**
 * Show error notification
 */
export function showErrorNotification(
  error: any,
  customMessage?: string
): void {
  const apiError = handleApiError(error);
  const displayMessage = customMessage || apiError.message;
  
  // ✅ THAY THẾ: Dùng toast.error từ Sonner
  // Dùng toast.error(title, { description }) để tận dụng cấu hình theme của bạn
  toast.error("Lỗi API", {
    description: displayMessage,
    duration: 5000,
  });

  // Log chi tiết error (dev only)
  if (process.env.NODE_ENV === "development") {
    console.error("🚨 API Error:", {
      code: apiError.code,
      message: apiError.message,
      originalError: apiError.originalError,
      response: apiError.response,
    });
  }
}

/**
 * Check if error matches specific error code
 */
export function isErrorCode(
  error: any,
  errorCode: { code: number; message: string }
): boolean {
  const apiError = handleApiError(error);
  return apiError.code === errorCode.code;
}

/**
 * Check if error is authentication error
 */
export function isAuthError(error: any): boolean {
  const apiError = handleApiError(error);
  return (
    apiError.code === ERROR_CODES.UNAUTHORIZED.code ||
    apiError.code === ERROR_CODES.TOKEN_EXPIRED.code ||
    apiError.code === ERROR_CODES.TOKEN_INVALID.code ||
    apiError.code === ERROR_CODES.SESSION_EXPIRED.code
  );
}

/**
 * Check if error is validation error
 */
export function isValidationError(error: any): boolean {
  const apiError = handleApiError(error);
  return (
    apiError.code === ERROR_CODES.INVALID_REQUEST.code ||
    apiError.code === ERROR_CODES.MISSING_REQUIRED_FIELDS.code ||
    apiError.code === ERROR_CODES.DATA_FORMAT_ERROR.code
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(
  error: any,
  fallbackMessage?: string
): string {
  try {
    const apiError = handleApiError(error);

    // Nếu có message từ backend, ưu tiên sử dụng
    if (apiError.message) {
      return apiError.message;
    }

    // Fallback về error code message
    const errorCodeMessage = getErrorMessageByCode(apiError.code);
    if (errorCodeMessage) {
      return errorCodeMessage;
    }

    // Cuối cùng dùng fallback
    return fallbackMessage || "Đã có lỗi xảy ra. Vui lòng thử lại.";
  } catch {
    return fallbackMessage || "Đã có lỗi xảy ra. Vui lòng thử lại.";
  }
}

/**
 * Format error for logging
 */
export function formatErrorForLogging(error: any): {
  code: number;
  message: string;
  stack?: string;
  url?: string;
  method?: string;
  status?: number;
  timestamp: string;
} {
  const apiError = handleApiError(error);

  return {
    code: apiError.code,
    message: apiError.message,
    stack: apiError.originalError?.stack,
    url: apiError.originalError?.config?.url,
    method: apiError.originalError?.config?.method?.toUpperCase(),
    status: apiError.originalError?.response?.status,
    timestamp: new Date().toISOString(),
  };
}