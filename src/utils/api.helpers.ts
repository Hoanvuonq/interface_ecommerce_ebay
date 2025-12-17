/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Helpers
 * Các helper functions để làm việc với API calls
 */

import { ApiError, handleApiError, showErrorNotification, getUserFriendlyMessage } from './api.error.handler';
import { ApiResponse } from '@/api/_types/api.types';

export async function safeApiCall<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    options?: {
        skipAutoNotification?: boolean;
        errorMessage?: string;
        returnNull?: boolean;
    }
): Promise<T | null> {
    try {
        const response = await apiCall();
        if (!response.success) {
            throw new ApiError(
                response.code,
                response.message || 'Request không thành công',
                null,
                { success: false, code: response.code, message: response.message, data: response.data }
            );
        }

        return response.data;
    } catch (error) {
        const apiError = handleApiError(error);

        // Nếu có custom message, hiển thị message đó (ghi đè auto notification)
        if (options?.errorMessage) {
            showErrorNotification(apiError, options.errorMessage);
        }
        // Lưu ý: Axios interceptor đã tự động show notification rồi
        // Không cần show thêm ở đây

        // Return null hoặc throw error
        if (options?.returnNull) {
            return null;
        }

        throw apiError;
    }
}

/**
 * Safe API Call with default value
 * @param apiCall - Function thực hiện API call
 * @param defaultValue - Giá trị mặc định khi có error
 * @param options - Options cho error handling
 * @returns Data hoặc default value
 * 
 * NOTE: Error notification đã được TỰ ĐỘNG hiển thị bởi axios interceptor.
 */
export async function safeApiCallWithDefault<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    defaultValue: T,
    options?: {
        skipAutoNotification?: boolean;
        errorMessage?: string;
    }
): Promise<T> {
    try {
        const response = await apiCall();

        if (!response.success) {
            throw new ApiError(
                response.code,
                response.message || 'Request không thành công',
                null,
                { success: false, code: response.code, message: response.message, data: response.data }
            );
        }

        return response.data;
    } catch (error) {
        // Nếu có custom message, show custom message
        if (options?.errorMessage) {
            showErrorNotification(error, options.errorMessage);
        }
        // Axios interceptor đã tự động show notification rồi

        return defaultValue;
    }
}

/**
 * Extract data từ ApiResponse
 * Đơn giản hóa việc lấy data từ response
 */
export function extractData<T>(response: ApiResponse<T>): T {
    if (!response.success) {
        throw new ApiError(
            response.code,
            response.message || 'Request không thành công',
            null,
            { success: false, code: response.code, message: response.message, data: response.data }
        );
    }
    return response.data;
}

/**
 * Try-catch wrapper cho async functions
 */
export async function tryCatch<T>(
    fn: () => Promise<T>,
    onError?: (error: ApiError) => void
): Promise<T | null> {
    try {
        return await fn();
    } catch (error) {
        const apiError = handleApiError(error);

        if (onError) {
            onError(apiError);
        }

        return null;
    }
}

/**
 * Batch API calls - Thực hiện nhiều API calls cùng lúc
 * 
 * NOTE: Error notification đã được TỰ ĐỘNG hiển thị cho mỗi call bị lỗi.
 */
export async function batchApiCalls<T>(
    apiCalls: Array<() => Promise<ApiResponse<T>>>,
    options?: {
        skipAutoNotification?: boolean;
        continueOnError?: boolean; // Tiếp tục nếu có call bị lỗi
    }
): Promise<Array<T | null>> {
    if (options?.continueOnError) {
        // Thực hiện tất cả calls, return null cho các calls lỗi
        return Promise.all(
            apiCalls.map(call =>
                safeApiCall(call, { returnNull: true })
            )
        );
    } else {
        // Dừng ngay khi có call lỗi
        const results: Array<T | null> = [];
        for (const call of apiCalls) {
            const result = await safeApiCall(call);
            results.push(result);
        }
        return results;
    }
}

/**
 * Retry API call với số lần retry và delay
 * 
 * NOTE: Error notification sẽ CHỈ hiển thị lần cuối cùng (khi tất cả retries failed).
 * Các lần retry bị skip auto notification.
 */
export async function retryApiCall<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    options?: {
        maxRetries?: number; // Số lần retry tối đa (default: 3)
        delay?: number; // Delay giữa các lần retry (ms) (default: 1000)
        skipAutoNotification?: boolean; // Skip notification khi tất cả retries failed
        errorMessage?: string; // Custom message cho lần cuối
    }
): Promise<T | null> {
    const maxRetries = options?.maxRetries ?? 3;
    const delay = options?.delay ?? 1000;

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await apiCall();

            if (!response.success) {
                throw new ApiError(
                    response.code,
                    response.message || 'Request không thành công',
                    null,
                    { success: false, code: response.code, message: response.message, data: response.data }
                );
            }

            return response.data;
        } catch (error) {
            lastError = error;

            // Nếu chưa hết retries, đợi và thử lại
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
        }
    }

    // Tất cả retries failed - show custom message nếu có
    if (options?.errorMessage) {
        showErrorNotification(lastError, options.errorMessage);
    }
    // Axios interceptor sẽ tự show notification cho lần fail cuối cùng

    return null;
}

/**
 * Check if API response is successful
 */
export function isApiSuccess<T>(response: ApiResponse<T>): boolean {
    return response.success === true && response.code === 1000;
}

/**
 * Get error message from API response or error
 */
export function getApiErrorMessage(error: any): string {
    return getUserFriendlyMessage(error);
}

