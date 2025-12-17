export interface PageSortDTO {
    sorted: boolean;
    unsorted: boolean;
}

export interface PageableDTO {
    pageNumber: number;
    pageSize: number;
    offset?: number;
    paged?: boolean;
    unpaged?: boolean;
    sort?: PageSortDTO;
}

export interface PageDTO<T> {
    content: T[];
    pageable: PageableDTO;
    totalElements: number;
    totalPages: number;
    last?: boolean;
    first?: boolean;
    numberOfElements?: number;
    size?: number;
    number?: number;
    sort?: PageSortDTO;
}

export interface ApiResponseDTO<T> {
    success: boolean;
    message?: string;
    data: T;
}

