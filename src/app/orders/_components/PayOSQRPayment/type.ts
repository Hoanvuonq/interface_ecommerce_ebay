export interface PayOSQRPaymentProps {
  orderId: string;
  orderNumber: string;
  amount: number;
  onCancelPayment?: () => void;
  onRefresh?: () => void;
}