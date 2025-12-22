import { OrderResponse } from "@/types/orders/order.types";

export interface OrderDetailViewProps {
  order: OrderResponse;
}

export interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
