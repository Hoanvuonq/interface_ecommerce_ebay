import { ORDER_STATUS_TEXT, OrderStatus } from "@/types/orders/order.dto";
import { cn } from "@/utils/cn";

export const renderStatus = (status: OrderStatus) => {
  const configs: Record<OrderStatus, string> = {
    [OrderStatus.CREATED]: "bg-slate-100  text-gray-700 border-slate-200",
    [OrderStatus.AWAITING_PAYMENT]:"bg-amber-50 text-amber-700 border-amber-200",
    [OrderStatus.PAID]: "bg-emerald-50 text-emerald-700 border-emerald-200",
    [OrderStatus.FULFILLING]: "bg-cyan-50 text-cyan-700 border-cyan-200",
    [OrderStatus.READY_FOR_PICKUP]: "bg-violet-50 text-violet-700 border-violet-200",
    [OrderStatus.SHIPPED]: "bg-indigo-50 text-indigo-700 border-indigo-200",
    [OrderStatus.OUT_FOR_DELIVERY]: "bg-sky-50 text-sky-700 border-sky-200",
    [OrderStatus.DELIVERED]: "bg-green-50 text-green-700 border-green-200",
    [OrderStatus.COMPLETED]: "bg-green-100 text-green-800 border-green-300",
    [OrderStatus.CANCELLED]: "bg-red-50 text-red-700 border-red-200",
    [OrderStatus.REJECTED]: "bg-red-100 text-red-800 border-red-300",
    [OrderStatus.RETURN_REQUESTED]:"bg-orange-50 text-orange-700 border-orange-200",
    [OrderStatus.RETURN_APPROVED]:"bg-orange-100 text-orange-800 border-orange-300",
    [OrderStatus.RETURNING]: "bg-purple-50 text-purple-700 border-purple-200",
    [OrderStatus.RETURNED]: "bg-purple-100 text-purple-800 border-purple-300",
    [OrderStatus.RETURN_DISPUTED]:"bg-yellow-50 text-yellow-700 border-yellow-200",
    [OrderStatus.RETURN_REJECTED]: "bg-red-100 text-red-800 border-red-300",
    [OrderStatus.REFUND_PENDING]: "bg-pink-50 text-pink-700 border-pink-200",
    [OrderStatus.REFUNDING]: "bg-pink-100 text-pink-800 border-pink-300",
    [OrderStatus.REFUNDED]: "bg-rose-100 text-rose-800 border-rose-300",
    [OrderStatus.DELIVERY_FAILED]: "bg-red-50 text-red-700 border-red-200",
    [OrderStatus.RETURNING_TO_SENDER]:"bg-orange-50 text-orange-700 border-orange-200",
    [OrderStatus.RETURNED_TO_SENDER]: "bg-orange-100 text-orange-800 border-orange-300",
  };

  const defaultConfig = "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={cn(
        "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm inline-flex items-center justify-center min-w-20",
        configs[status] || defaultConfig,
      )}
    >
      {ORDER_STATUS_TEXT[status] || status}
    </span>
  );
};
