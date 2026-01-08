export interface OrderHeaderProps {
  order: any;
  ui: {
    statusInfo: any;
    isDelivered: boolean;
    isCancelled: boolean;
    canCancel: boolean;
    paymentLabel: string;
  };
  actions: {
    handleCopyOrderNumber: () => void;
    setCancelModalVisible: (visible: boolean) => void;
    handleRefresh: () => void;
  };
}