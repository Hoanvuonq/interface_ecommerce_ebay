export interface BannerFilterState {
  searchText: string;
  locale: string;
  categoryIds: string[];
}

export interface BannerFiltersProps {
  filters: BannerFilterState;
  setFilters: React.Dispatch<React.SetStateAction<BannerFilterState>>;
  categories: { id: string; name: string }[];
  categoryLoading?: boolean;
  onSearch: () => void;
  onReset: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}