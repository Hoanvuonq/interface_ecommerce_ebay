"use client";

import { CustomBreadcrumb } from "@/components";
import { Button } from "@/components/button/button";
import PageContentTransition from "@/features/PageContentTransition";
import { useOrders } from "@/hooks/useOrders";
import { motion, Variants } from "framer-motion";
import _ from "lodash";
import {
  Inbox,
  Loader2,
  RotateCw,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { OrderCard } from "../_components/OrderCard";
import { OrderFilters } from "../_components/OrderFilters";

export const OrdersScreen = () => {
  const router = useRouter();
  const { data: orders = [], isLoading: loading, refetch } = useOrders();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (statusFilter !== "ALL") {
      result = _.filter(result, { status: statusFilter });
    }

    if (!_.isEmpty(searchText)) {
      const query = _.toLower(searchText);
      result = _.filter(
        result,
        (order) =>
          _.includes(_.toLower(order.orderNumber), query) ||
          _.some(order.items, (item) =>
            _.includes(_.toLower(item.productName), query)
          )
      );
    }

    return result;
  }, [orders, searchText, statusFilter]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-10">
      <PageContentTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <CustomBreadcrumb
            items={[
              { title: "Trang chủ", href: "/" },
              { title: "Đơn hàng của tôi", href: "" },
            ]}
          />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
            <div className="px-6 sm:px-8 py-6 border-b border-gray-100 bg-white">
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
                  onClick={() => refetch()}
                  icon={
                    <RotateCw
                      className={loading ? "animate-spin" : ""}
                      size={16}
                    />
                  }
                >
                  Làm mới
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
                  <OrderFilters
                    searchText={searchText}
                    statusFilter={statusFilter}
                    onSearchChange={setSearchText}
                    onStatusChange={setStatusFilter}
                  />
              </div>
            </div>

            <div className="px-6 sm:px-8 py-8 bg-gray-50/30 min-h-100">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-20">
                  <Loader2 size={40} className="text-orange-500 animate-spin" />
                  <p className="mt-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Đang đồng bộ dữ liệu...
                  </p>
                </div>
              ) : _.isEmpty(filteredOrders) ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Inbox size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Không tìm thấy đơn hàng
                  </h3>
                  <Link href="/products" className="mt-6">
                    <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95">
                      Tiếp tục mua sắm
                    </button>
                  </Link>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {filteredOrders.map((order) => (
                    <motion.div key={order.orderId} variants={itemVariants}>
                      <OrderCard
                        order={order as any}
                        onViewDetail={(id) => router.push(`/orders/${id}`)}
                        onOrderCancelled={() => refetch()}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </PageContentTransition>
    </div>
  );
};
