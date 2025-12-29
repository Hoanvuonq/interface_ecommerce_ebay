export interface ShopApprovalToolbarProps {
  searchText: string;
  setSearchText: (value: string) => void;
  pageSize: number;
  loading: boolean;
  onSearch: (activeTab: string, text: string, page: number) => void;
  onRefresh: () => void;
  onReset: () => void;
  onPageSizeChange: (newSize: number) => void;
  activeTab: string;
}