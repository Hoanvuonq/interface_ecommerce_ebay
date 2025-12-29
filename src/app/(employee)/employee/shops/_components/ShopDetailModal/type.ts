export interface ShopDetailModalProps {
  open: boolean;
  shop?: any;
  detailData?: any;
  loading?: boolean;
  legalLoading?: boolean;
  taxLoading?: boolean;
  onClose: () => void;
  onApproveLegal: (shopId: string, legalId: string) => void;
  onRejectLegal: (shopId: string, legalId: string, reason: string) => void;
  onApproveTax: (shopId: string, taxId: string) => void;
  onRejectTax: (shopId: string, taxId: string, reason: string) => void;
}