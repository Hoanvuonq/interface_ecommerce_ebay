export interface OrderSideInfoProps {
  order: any;
  shippingFee: number;
  paymentLabel: string;
  showPayment: boolean;     
  refreshKey: number;      
  handleCancelPayment: () => void;
  handleRefresh: () => void;      
}