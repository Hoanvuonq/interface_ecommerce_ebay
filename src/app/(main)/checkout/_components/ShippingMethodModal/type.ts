export interface ShippingMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loadingPrice: boolean;
  priceData: any;
}
