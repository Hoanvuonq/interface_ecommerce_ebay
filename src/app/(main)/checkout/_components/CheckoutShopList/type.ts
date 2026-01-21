export interface CheckoutShopListProps {
  shops: any[];
  voucherApplication: any;
  loading: boolean;
  updateShippingMethod: (shopId: string, methodCode: string) => void;
  request: any;
  preview: any;
}