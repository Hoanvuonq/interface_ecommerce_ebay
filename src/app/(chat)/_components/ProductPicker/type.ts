export interface ProductPickerProps {
  isVisible: boolean;
  onClose: () => void;
  products: any[];
  isLoading: boolean;
  searchText: string;
  onSearchChange: (value: string) => void;
  onSendDirect: (product: any) => void;
  onViewDetails: (product: any) => void;
  isSending: boolean;
}