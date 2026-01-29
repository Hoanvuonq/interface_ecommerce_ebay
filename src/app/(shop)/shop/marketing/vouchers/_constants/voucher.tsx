import {
  DiscountType,
  VoucherScope,
} from "@/app/(employee)/employee/vouchers/_types/voucher-v2.type";
import dayjs from "dayjs";
import {
  CheckCircle2,
  DollarSign,
  FileText,
  Package,
  Tag,
  Zap,
} from "lucide-react";
import { StatusTabItem } from "../../../_components";

export const INITIAL_VOUCHER_FORM = {
  voucherScope: VoucherScope.SHOP_ORDER,
  discountType: DiscountType.FIXED_AMOUNT,
  maxUsage: 100,
  applyToAllProducts: true,
  applyToAllCustomers: true,
  code: "",
  name: "",
  description: "",
  discountValue: 0,
  minOrderAmount: 0,
  maxDiscount: 0,
  startDate: dayjs().format("YYYY-MM-DDTHH:mm"),
  endDate: dayjs().add(7, "day").format("YYYY-MM-DDTHH:mm"),
  productIds: [],
};

export const generateModeTabs: StatusTabItem<string>[] = [
  { key: "manual", label: "Nhập thủ công", icon: FileText },
  { key: "auto", label: "Hệ thống tự tạo", icon: Zap },
];

export const discountTypeTabs: StatusTabItem<string>[] = [
  {
    key: DiscountType.FIXED_AMOUNT,
    label: "Số tiền cố định",
    icon: DollarSign,
  },
  { key: DiscountType.PERCENTAGE, label: "Theo phần trăm", icon: Tag },
];

export const scopeTabs: StatusTabItem<string>[] = [
  { key: "all", label: "Tất cả sản phẩm", icon: Package },
  { key: "selective", label: "Chọn lọc cụ thể", icon: CheckCircle2 },
];
