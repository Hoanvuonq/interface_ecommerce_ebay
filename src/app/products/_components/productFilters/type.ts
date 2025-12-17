export type ProductFilterValues = {
  keyword?: string;
  categoryId?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string; 
  brands?: string[];
  minRating?: number;
  inStock?: boolean;
  onSale?: boolean;
};

export const BRAND_OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Samsung", value: "samsung" },
  { label: "Xiaomi", value: "xiaomi" },
  { label: "Huawei", value: "huawei" },
  { label: "Oppo", value: "oppo" },
  { label: "Vivo", value: "vivo" },
  { label: "OnePlus", value: "oneplus" },
  { label: "Realme", value: "realme" },
];

export const SORT_OPTIONS = [
  { label: "Mới nhất", value: "createdDate,desc" },
  { label: "Giá tăng dần", value: "basePrice,asc" },
  { label: "Giá giảm dần", value: "basePrice,desc" },
  { label: "Tên A-Z", value: "name,asc" },
  { label: "Tên Z-A", value: "name,desc" },
  { label: "Cập nhật gần nhất", value: "lastModifiedDate,desc" },
];

export const PRICE_PRESETS = [
  { label: "Dưới 1 triệu", min: 0, max: 1_000_000 },
  { label: "1 - 5 triệu", min: 1_000_000, max: 5_000_000 },
  { label: "5 - 10 triệu", min: 5_000_000, max: 10_000_000 },
  { label: "10 - 20 triệu", min: 10_000_000, max: 20_000_000 },
  { label: "20 - 50 triệu", min: 20_000_000, max: 50_000_000 },
  { label: "Trên 50 triệu", min: 50_000_000, max: 100_000_000 },
];
