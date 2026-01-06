"use client";

import { CustomBreadcrumb, CustomButton } from "@/components";
import PageContentTransition from "@/features/PageContentTransition";
import { useOrders } from "@/hooks/useOrders";
import { motion, Variants } from "framer-motion";
import _ from "lodash";
import {
  Inbox,
  Loader2,
  Search,
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

  if (statusFilter && statusFilter !== "ALL") {
    result = _.filter(result, (order) => order.status === statusFilter);
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
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm">
                    <ShoppingBag size={18} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold text-gray-900">
                      Đơn hàng của tôi
                    </h1>
                    <p className="text-xs text-gray-500 ">
                      Quản lý và theo dõi đơn hàng của bạn
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
                <OrderFilters
                  searchText={searchText}
                  statusFilter={statusFilter}
                  onSearchChange={setSearchText}
                  onStatusChange={setStatusFilter}
                  onRefresh={() => refetch()}
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
                <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 my-4 animate-in fade-in zoom-in duration-500">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center shadow-inner">
                      <Inbox
                        size={48}
                        strokeWidth={1.5}
                        className="text-slate-300"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                      <Search
                        size={14}
                        className="text-orange-600"
                        strokeWidth={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-center max-w-xs mb-5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                      Chúng tôi không tìm thấy bất kỳ đơn hàng nào khớp với yêu
                      cầu của bạn.
                    </p>
                  </div>

                  <Link href="/products">
                    <CustomButton
                      variant="dark"
                      className="h-14 px-6 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-orange-200/50 transition-all duration-300 group"
                      icon={
                        <div className="bg-orange-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                          <ShoppingBag size={18} className="text-white" />
                        </div>
                      }
                    >
                      <span className="font-bold uppercase tracking-widest text-xs ml-2">
                        Bắt đầu mua sắm ngay
                      </span>
                    </CustomButton>
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
