import { PublicProductDetailDTO } from "@/types/product/public-product.dto";

export interface CustomUploadFile {
    uid: string;
    name: string;
    status: 'uploading' | 'done' | 'error';
    url?: string;
    originFileObj?: File;
}

export interface WishlistFormData {
    wishlistId: string;
    variantId: string;
    quantity: number;
    priority: number;
    newWishlistName: string;
    newWishlistDescription: string;
    desiredPrice: string;
    notes: string;
    [key: string]: any; 
}

export type FormErrors = {
    [K in keyof WishlistFormData]?: string;
};



export interface AddToWishlistModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess?: () => void;
    product: PublicProductDetailDTO | null;
    defaultVariantId?: string;
}