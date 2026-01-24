import React from "react";

export const OrderListHeader: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Quản lý đơn hàng
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Theo dõi và xử lý tất cả đơn hàng trên hệ thống
      </p>
    </div>
  );
};

