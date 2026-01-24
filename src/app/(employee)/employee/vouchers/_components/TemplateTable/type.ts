import { VoucherTemplate } from "../../_types/voucher-v2.type";

export interface TemplateTableProps {
  data: VoucherTemplate[];
  loading?: boolean;
  onView?: (template: VoucherTemplate) => void;
  onEdit?: (template: VoucherTemplate) => void;
  onDelete?: (template: VoucherTemplate) => void;
  onToggleStatus?: (template: VoucherTemplate) => void;
  onCheckUsage?: (template: VoucherTemplate) => void;
  onUsePlatform?: (template: VoucherTemplate) => void;
  "data-testid"?: string;
}
