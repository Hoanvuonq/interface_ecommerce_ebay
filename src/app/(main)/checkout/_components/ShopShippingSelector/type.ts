interface ShippingOption {
  code: string;
  providerName: string;
  methodName: string;
  fee: number;
  estimatedDeliveryText?: string;
}

export interface ShopShippingSelectorProps {
  shopId: string;
  shopName: string;
  availableOptions: ShippingOption[];
  selectedMethodCode?: string;
  isLoading: boolean;
  onMethodChange: (shopId: string, methodCode: string) => void;
}
