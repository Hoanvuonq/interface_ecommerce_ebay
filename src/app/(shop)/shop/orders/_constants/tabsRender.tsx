import { OrderStatus } from "@/types/orders/order.dto";
import {
  LayoutGrid,
  Wallet,
  Clock,
  Package,
  Truck,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

export const TAB_KEYS = {
  ALL: "ALL",
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  PENDING_CONFIRM: "PENDING_CONFIRM",
  READY_TO_SHIP: "READY_TO_SHIP",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  RETURNS_REFUNDS: "RETURNS_REFUNDS",
} as const;

export interface OrderStatistics {
  total: number;
  awaitingPayment: number;
  pendingConfirm: number;
  readyToShip: number;
  shipping: number;
  delivered: number;
  returnsRefunds: number;
}

export const TAB_STATUS_MAP: Record<string, OrderStatus[]> = {
  [TAB_KEYS.AWAITING_PAYMENT]: [OrderStatus.AWAITING_PAYMENT],
  [TAB_KEYS.PENDING_CONFIRM]: [OrderStatus.CREATED, OrderStatus.PAID],
  [TAB_KEYS.READY_TO_SHIP]: [OrderStatus.FULFILLING, OrderStatus.READY_FOR_PICKUP],
  [TAB_KEYS.SHIPPING]: [OrderStatus.SHIPPED, OrderStatus.OUT_FOR_DELIVERY],
  [TAB_KEYS.DELIVERED]: [OrderStatus.DELIVERED],
  [TAB_KEYS.RETURNS_REFUNDS]: [OrderStatus.CANCELLED, OrderStatus.REFUNDING, OrderStatus.REFUNDED],
};

export const getOrderTabs = (statistics: OrderStatistics) => [
  {
    key: TAB_KEYS.ALL,
    label: "Tất cả",
    icon: LayoutGrid,
    count: statistics.total,
  },
  {
    key: TAB_KEYS.AWAITING_PAYMENT,
    label: "Chờ thanh toán",
    icon: Wallet,
    count: statistics.awaitingPayment,
  },
  {
    key: TAB_KEYS.PENDING_CONFIRM,
    label: "Chờ xác nhận",
    icon: Clock,
    count: statistics.pendingConfirm,
  },
  {
    key: TAB_KEYS.READY_TO_SHIP,
    label: "Chờ lấy hàng",
    icon: Package,
    count: statistics.readyToShip,
  },
  {
    key: TAB_KEYS.SHIPPING,
    label: "Đang giao",
    icon: Truck,
    count: statistics.shipping,
  },
  {
    key: TAB_KEYS.DELIVERED,
    label: "Đã giao",
    icon: CheckCircle,
    count: statistics.delivered,
  },
  {
    key: TAB_KEYS.RETURNS_REFUNDS,
    label: "Trả hàng/Hủy",
    icon: RotateCcw,
    count: statistics.returnsRefunds,
  },
];