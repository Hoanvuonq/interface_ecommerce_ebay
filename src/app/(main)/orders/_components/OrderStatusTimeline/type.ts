export interface Step {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface OrderStatusTimelineProps {
  status: string;
  createdAt: string;
  updatedAt?: string;
  trackingNumber?: string; 
  carrier?: string;        
}