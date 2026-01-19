export interface FilterBarProps {
    keyword: string;
    setKeyword: (value: string) => void;
    categoryId: string;
    setCategoryId: (value: string) => void;
    shopId: string;
    setShopId: (value: string) => void;
    minPrice: string;
    setMinPrice: (value: string) => void;
    maxPrice: string;
    setMaxPrice: (value: string) => void;
    onApply: () => void;
    onClear: () => void;
}