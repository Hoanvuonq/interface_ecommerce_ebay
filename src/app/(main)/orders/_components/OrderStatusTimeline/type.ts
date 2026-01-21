export interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface OrderStatusTimelineProps {
  status: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  trackingNumber?: string | null;
  carrier?: string | null;
}