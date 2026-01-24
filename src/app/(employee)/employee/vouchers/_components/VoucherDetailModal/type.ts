import {
  VoucherInfoResponse,
  VoucherTemplate,
} from "../../_types/voucher-v2.type";

export interface VoucherDetailModalProps {
  open: boolean;
  onClose: () => void;
  template?: VoucherTemplate | null;
  voucherInfo?: VoucherInfoResponse | null;
  isLoading: boolean;
  onUseInstance: (instanceId: string) => void;
}
