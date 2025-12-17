export interface ProductVariantAttributesDTO {
    [key: string]: string;
}

export interface ProductVariantDTO {
    id: string;
    productId: string;
    sku: string;
    name: string;
    price: number;
    comparePrice?: number;
    stock: number;
    active: boolean;
    attributes: ProductVariantAttributesDTO;
    images?: string[];
    createdDate?: string;
    version: number;
}

export interface VariantOptionSelection {
    optionName: string;
    value: string;
}

export interface CreateProductVariantDTO {
    sku: string;
    imageAssetId?: string;
    corePrice: number;
    price: number;
    stockQuantity: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    weightGrams: number;
    options?: VariantOptionSelection[];
}

export interface UpdateProductVariantUpsertDTO extends CreateProductVariantDTO {
    variantId: string;
}

export interface UpsertProductVariantsDTO {
    createRequests?: CreateProductVariantDTO[];
    updateRequests?: UpdateProductVariantUpsertDTO[];
}

export interface UpdateProductVariantDTO {
    name?: string;
    price?: number;
    comparePrice?: number;
    stock?: number;
    active?: boolean;
    attributes?: ProductVariantAttributesDTO;
    images?: string[];
}

export type SyncProductVariantsDTO = UpsertProductVariantsDTO;

