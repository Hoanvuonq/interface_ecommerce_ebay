import { GroupedVouchers, VoucherOption } from "../../_types/voucher";

export interface ContentProps {
  loading: boolean;
  isGrouped: boolean;
  groupedVouchers: GroupedVouchers;
  vouchers: VoucherOption   [];
  selectedOrderId?: string;
  selectedShipId?: string;
  onSelectOrder: (id: string | undefined) => void;
  onSelectShip: (id: string | undefined) => void;
  voucherCode: string;
  onCodeChange: (code: string) => void;
}