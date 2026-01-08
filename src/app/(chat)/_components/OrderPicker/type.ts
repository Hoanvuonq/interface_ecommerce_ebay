export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  imageBasePath?: string;
  imageExtension?: string;
  variantAttributes?: string;
}

export interface Order {
  orderId: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  grandTotal: number;
  totalQuantity?: number;
}

export interface OrderPickerProps {
  isVisible: boolean;
  onClose: () => void;
  orders: Order[];
  isLoading: boolean;
  searchText: string;
  onSearchChange: (value: string) => void;
  onSendDirect: (order: Order) => void;
  onViewDetails: (order: Order) => void;
  isSending: boolean;
  getStatusText: (status?: string) => string | undefined;
  resolveOrderItemImageUrl: (
    path?: string | null,
    ext?: string | null,
    size?: "_thumb" | "_medium" | "_large" | "_orig"
  ) => string;
}
