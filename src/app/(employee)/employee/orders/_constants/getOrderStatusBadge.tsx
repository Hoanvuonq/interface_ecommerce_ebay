import React from "react";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  let colorClass =
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  let label = status;

  switch (status) {
    case "COMPLETED":
    case "DELIVERED":
      colorClass =
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      label = "Hoàn thành";
      break;
    case "PENDING":
    case "PROCESSING":
      colorClass =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      label = "Đang xử lý";
      break;
    case "CANCELLED":
      colorClass =
        "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      label = "Đã hủy";
      break;
    case "CONFIRMED":
    case "WAITING_CONFIRMATION":
      colorClass =
        "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      label = "Chờ xác nhận";
      break;
    case "SHIPPING":
      colorClass =
        "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
      label = "Đang giao";
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
};

