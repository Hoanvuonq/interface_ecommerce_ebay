/**
 * Rich Text Paragraph Types
 * For multi-media product descriptions
 */

export type RichTextParagraphType = "TEXT" | "IMAGE" | "BREAK";

export interface RichTextParagraphDTO {
    id: string;
    productId: string;
    displayOrder: number;
    type: RichTextParagraphType;

    // Text fields
    contentText?: string;

    // Image fields
    mediaAssetId?: string;
    mediaUrl?: string; // Computed from BE
    imageRatio?: number;
    imageAltText?: string;
    imageCaption?: string;

    // Audit fields
    createdBy: string;
    createdDate: string;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
}

export interface CreateRichTextParagraphDTO {
    displayOrder: number;
    type: RichTextParagraphType;

    // Optional fields based on type
    contentText?: string;
    mediaAssetId?: string;
    imageRatio?: number;
    imageAltText?: string;
    imageCaption?: string;
}

export interface UpdateRichTextParagraphDTO {
    displayOrder?: number;
    type?: RichTextParagraphType;
    contentText?: string;
    mediaAssetId?: string;
    imageRatio?: number;
    imageAltText?: string;
    imageCaption?: string;
}

export interface ReorderParagraphsDTO {
    items: OrderItemDTO[];
}

export interface OrderItemDTO {
    paragraphId: string;
    newOrder: number;
}
