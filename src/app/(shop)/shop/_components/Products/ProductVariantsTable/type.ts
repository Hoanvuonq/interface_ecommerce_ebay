export interface Variant {
  sku: string;
  corePrice: number;
  price: number;
  stockQuantity: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightGrams?: number;
  optionValueNames: string[];
  imagePath?: string;
  imageProcessing?: boolean;
  [key: string]: any;
}

export interface ProductVariantsTableProps {
  variants: Variant[];
  optionNames: string[];
  onUpdateVariants: (newVariants: Variant[]) => void;
  onUploadImage: (file: File, index: number) => Promise<void>;
}
