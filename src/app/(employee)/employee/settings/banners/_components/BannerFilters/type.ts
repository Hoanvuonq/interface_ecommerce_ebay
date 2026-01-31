export interface BannerFilterState {
  searchText: string;
  locale?: string; // Thêm dấu ? để cho phép undefined
  categoryIds: string[];
}

export interface BannerFiltersProps {
  filters: BannerFilterState;
  setFilters: React.Dispatch<React.SetStateAction<BannerFilterState>>;
  categories: any;
  categoryLoading: boolean;
  onSearch: () => void;
  onReset: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}