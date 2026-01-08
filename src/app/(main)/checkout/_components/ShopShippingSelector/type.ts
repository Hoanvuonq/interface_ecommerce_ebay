interface ShippingOption {
  code: string;
  estimatedDeliveryTime?: string;
  serviceCode: number | string;
  fee: number;
  displayName?: string;
  serviceType?: string;
}

export interface ShopShippingSelectorProps {
  shopId: string;
  shopName: string;
  availableOptions: ShippingOption[];
  selectedMethodCode?: string;
  isLoading: boolean;
  onMethodChange: (shopId: string, methodCode: string) => void;
}
