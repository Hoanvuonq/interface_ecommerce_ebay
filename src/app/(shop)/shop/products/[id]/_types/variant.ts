export type StatusEnumType = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export interface VariantRow  {
  rowKey: string;
  variantId?: string;
  sku: string;
  imageAssetId?: string;
  imageUrl?: string;
  corePrice: number;
  price: number;
  stockQuantity: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightGrams: number;
  optionValues: Record<string, string>;
  isNew?: boolean;
};

export interface VariantFormValues  {
  variantId?: string;
  sku: string;
  imageAssetId?: string;
  imageUrl?: string;
  corePrice: number;
  price: number;
  stockQuantity: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightGrams: number;
  optionValues: Record<string, string>;
};
