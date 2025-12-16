/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Response Types
 * Cấu trúc response từ Backend
 */

/**
 * Standard API Response từ Backend
 */
export interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}

/**
 * API Error Response từ Backend
 */
export interface ApiErrorResponse {
    success: false;
    code: number;
    message: string;
    data?: any;
}

/**
 * Pageable Response từ Backend
 */
export interface PageableResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

