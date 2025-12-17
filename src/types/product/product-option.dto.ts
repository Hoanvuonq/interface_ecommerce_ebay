export type ProductOptionType = 'SELECT' | 'TEXT' | 'NUMBER' | 'CHECKBOX';

export interface ProductOptionValueDTO {
    id?: string;
    value: string;
    label?: string;
    order?: number;
    active?: boolean;
    // Optional UI hints
    color?: string;
    size?: string;
}

export interface ProductOptionDTO {
    id: string;
    productId: string;
    name: string;
    type: ProductOptionType;
    required: boolean;
    order?: number;
    values?: ProductOptionValueDTO[];
    createdDate?: string;
    version: number;
}

export interface CreateProductOptionDTO {
    name: string;
    type: ProductOptionType;
    required: boolean;
    order?: number;
    values?: ProductOptionValueDTO[];
}

export interface UpdateProductOptionDTO {
    name?: string;
    type?: ProductOptionType;
    required?: boolean;
    order?: number;
    values?: ProductOptionValueDTO[];
}

export type SyncProductOptionsDTO = Array<{
    name: string;
    type: ProductOptionType;
    required: boolean;
    order?: number;
    values?: ProductOptionValueDTO[];
}>;

