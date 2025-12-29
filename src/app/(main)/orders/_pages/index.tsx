"use client";

import { CustomBreadcrumb } from "@/components";
import { Button } from "@/components/button/button";
import PageContentTransition from "@/features/PageContentTransition";
import { useOrders } from "@/hooks/useOrders";
import { cn } from "@/utils/cn";
import { motion, Variants } from "framer-motion";
import {
  Inbox,
  Loader2,
  RotateCw,
  ShoppingBag,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { OrderCard } from "../_components/OrderCard";
import { OrderFilters } from "../_components/OrderFilters";
import { STATUS_TABS } from "../_types/order";

export const OrdersScreen = () => {
  const router = useRouter();
  const { orders, loading, refetch } = useOrders();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) {
      return [];
    }

    let filtered = [...orders];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(lowerSearch) ||
          order.items.some((item) =>
            item.productName.toLowerCase().includes(lowerSearch)
          )
      );
    }

    return filtered;
  }, [orders, searchText, statusFilter]);

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const ordersLength = Array.isArray(orders) ? orders.length : 0;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <PageContentTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <CustomBreadcrumb
              items={[
                { title: "Trang chủ", href: "/" },
                { title: "Đơn hàng của tôi", href: "" },
              ]}
            />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 sm:px-8 py-6 sm:py-8 border-b border-gray-100 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Đơn hàng của tôi
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Quản lý và theo dõi đơn hàng của bạn
                    </p>
                  </div>
                </div>

                <Button
                  variant="edit"
                  onClick={refetch}
                  icon={<RotateCw className={loading ? "animate-spin" : ""} />}
                >
                  Làm mới
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border cursor-pointer",
                      `${
                        statusFilter === tab.key
                          ? "bg-orange-50 text-orange-600 border-orange-200 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50/50 border-b border-gray-100 px-6 sm:px-8 py-5">
              <OrderFilters
                searchText={searchText}
                statusFilter={statusFilter}
                onSearchChange={setSearchText}
                onStatusChange={setStatusFilter}
              />
            </div>

            <div className="px-6 sm:px-8 py-8 bg-gray-50/30 min-h-100">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-20">
                  <Loader2 size={40} className="text-orange-500 animate-spin" />
                  <p className="mt-4 text-gray-500 text-sm font-medium">
                    Đang tải đơn hàng...
                  </p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Inbox size={48} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {ordersLength === 0
                      ? "Bạn chưa có đơn hàng nào"
                      : "Không tìm thấy đơn hàng phù hợp"}
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-8">
                    {ordersLength === 0
                      ? "Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và đặt hàng ngay hôm nay!"
                      : "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn."}
                  </p>

                  {ordersLength === 0 && (
                    <Link href="/products">
                      <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5">
                        <ShoppingCart size={20} />
                        Bắt đầu mua sắm
                      </button>
                    </Link>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {filteredOrders.map((order) => (
                    <motion.div
                      key={order.orderId}
                      variants={itemVariants}
                      whileHover={{ scale: 1.005 }}
                      transition={{ duration: 0.2 }}
                    >
                      <OrderCard
                        order={order as any}
                        onViewDetail={handleViewOrder}
                        onOrderCancelled={refetch}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {!loading && filteredOrders.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 pt-6 border-t border-gray-200 text-center"
                >
                  <p className="text-gray-500 text-sm">
                    Hiển thị{" "}
                    <span className="font-semibold text-gray-900">
                      {filteredOrders.length}
                    </span>{" "}
                    /{" "}
                    <span className="font-semibold text-gray-900">
                      {ordersLength}
                    </span>{" "}
                    đơn hàng
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </PageContentTransition>
    </div>
  );
}
