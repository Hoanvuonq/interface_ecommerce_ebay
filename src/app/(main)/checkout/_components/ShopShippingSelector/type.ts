interface ShippingOption {
  code: string;
  serviceType: string;
  displayName: string;
  serviceCode: any;
  fee: number;
  estimatedDeliveryTime?: string;
}

export interface ShopShippingSelectorProps {
  shopId: string;
  shopName: string;
  availableOptions: ShippingOption[];
  selectedMethodCode?: string;
  isLoading: boolean;
  onMethodChange: (shopId: string, methodCode: string) => void;
}
