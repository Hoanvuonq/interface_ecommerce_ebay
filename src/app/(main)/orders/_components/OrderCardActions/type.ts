export interface ActionsProps {
  grandTotal: number;
  paymentMethod: string;
  isPendingPayment: boolean;
  paymentUrl?: string;
  canCancel: boolean;
  isDelivered: boolean;
  firstProductId?: string;
  onViewDetail: () => void;
  onCancelClick: () => void;
}