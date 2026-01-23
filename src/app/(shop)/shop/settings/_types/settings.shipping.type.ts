
export interface ShippingChannel {
  id: number;
  channelId: number;
  channelName: string;
  channelCode: string;
  estimatedDelivery: string;
  markupAmount: number;
  enabled: boolean;
}


export interface PaymentMethod {
  id: number;
  methodId: number;
  methodName: string;
  methodCode: string;
  enabled: boolean;
  description?: string;
}

