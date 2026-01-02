export interface TriggerProps {
  mounted: boolean;
  unreadCount: number;
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}
