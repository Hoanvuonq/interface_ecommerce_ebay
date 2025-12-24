export interface IPortalModal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  className?: string;
  preventCloseOnClickOverlay?: boolean;
}