import { CostsShipmentResponse } from "@/features/Shipment";
import _ from "lodash";

export const SHIPMENT_METHOD_NAMES: Record<string, string> = {
  GHN: "Giao hàng nhanh GHN",
  CONKIN: "Giao hàng Conkin",
};

export const getShipmentMethodName = (serviceCompanyType?: string): string => {
  const type = _.toUpper(serviceCompanyType || "");
  return SHIPMENT_METHOD_NAMES[type] || serviceCompanyType || "Phương thức vận chuyển";
};
export const getShipmentCost = (response: CostsShipmentResponse): number => {
  return response.costs || response.total || 0;
};

export const PAYMENT_METHODS = [
  {
    id: "COD",
    label: "Thanh toán khi nhận hàng (COD)",
    subLabel: "Thanh toán tiền mặt khi giao hàng",
  },
  {
    id: "PAYOS",
    label: "Chuyển khoản ngân hàng (QR)",
    subLabel: "Quét mã VietQR (PayOS)",
  },
  {
    id: "VNPAY",
    label: "Ví điện tử VNPAY",
    subLabel: "Cổng thanh toán VNPAY",
  },
];

export interface ICheckoutFormData {
  addressId?: string;
  paymentMethod?: 'COD' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'PAYOS';
  shippingMethod?: 'CONKIN' | 'STANDARD' | 'EXPRESS' | 'ECONOMY' | 'GHN' | 'GHTK' | 'VNPOST' | 'NINJA_VAN' | 'J&T' | 'BEST_EXPRESS' | 'FPT' | 'OTHER';
  customerNote: string;
  recipientName: string;
  phoneNumber: string;
  addressLine1: string;
  ward: string;
  district: string;
  province: string;
  email: string;
  country: string;
  globalVouchers?: string[];
  shippingVouchers?: string[];
}