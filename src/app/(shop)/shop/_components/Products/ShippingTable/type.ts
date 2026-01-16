export interface Variant {
  sku?: string;
  weightGrams?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  optionValueNames?: string[];
}

export interface ShippingTableProps {
  variants: Variant[];
  optionNames: string[];
  onUpdateVariant: (index: number, field: keyof Variant, value: any) => void;
}