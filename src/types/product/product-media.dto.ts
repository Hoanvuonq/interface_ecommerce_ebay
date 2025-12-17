export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

export interface MediaDimensionsDTO {
    width: number;
    height: number;
}

export interface ProductMediaDTO {
    id: string;
    productId: string;
    url: string;
    type: MediaType;
    isPrimary: boolean;
    order?: number;
    altText?: string;
    fileSize?: number;
    dimensions?: MediaDimensionsDTO;
    duration?: number; // for video/audio
    createdDate?: string;
    version: number;
}

export interface AddMediaItemDTO {
    url: string;
    type: MediaType;
    isPrimary?: boolean;
    sortOrder?: number;
    altText?: string;
    title?: string;
    duration?: number;
}

export interface BulkUpdateProductMediaDTO {
    productId: string;
    images?: AddMediaItemDTO[];  // List of images to ADD
    videos?: AddMediaItemDTO[];  // List of videos to ADD
    removeIds?: string[];        // List of media IDs to REMOVE
    setPrimaryId?: string;       // Media ID to set as PRIMARY
}

