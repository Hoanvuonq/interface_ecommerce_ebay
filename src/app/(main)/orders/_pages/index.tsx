"use client";

import { SectionPageComponents } from "@/features/SectionPageComponents";
import { AnimatePresence, motion } from "framer-motion";
import { Inbox, Search, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "react-loading-skeleton/dist/skeleton.css";
import { OrderCard } from "../_components/OrderCard";
import { OrderFilters } from "../_components/OrderFilters";
import { OrderSkeleton } from "../_components/OrderSkeleton";
import { OrderProvider, useOrderContext } from "../_contexts/OrderContext";
import { CustomButton } from "@/components";
import { EmptyProductState } from "../../products/_components/EmptyProductState";
const OrdersContent = () => {
  const router = useRouter();
  const { state, actions } = useOrderContext();
  const {
    orders,
    statusFilter,
    searchText,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isPlaceholderData,
    scrollRef,
  } = state;

  return (
    <SectionPageComponents
      loading={false}
      breadcrumbItems={[
        { title: "Trang chủ", href: "/" },
        { title: "Đơn hàng", href: "" },
      ]}
    >
      <div className="bg-white rounded-2xl shadow-custom border border-gray-100 mt-2">
        <div className="px-6 py-6 border-b border-gray-100">
          <OrderFilters />
        </div>

        <div
          className={`px-4 sm:px-6 py-6 bg-gray-50/50 min-h-125 transition-opacity duration-300 ${
            isPlaceholderData ? "opacity-60 pointer-events-none" : "opacity-100"
          }`}
        >
          {isLoading || (isFetching && orders.length === 0) ? (
            <div className="space-y-4">
              <OrderSkeleton />
              <OrderSkeleton />
              <OrderSkeleton />
            </div>
          ) : orders.length === 0 ? (
            <EmptyProductState
              message="Chúng tôi không tìm thấy bất kỳ đơn hàng nào khớp với yêu cầu của bạn."
              onReset={() => window.location.reload()}
            />
          ) : (
            <div className="space-y-4">
              <motion.div
                initial="hidden"
                animate="visible"
                className="space-y-4"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {orders.map((order, idx) => (
                    <motion.div
                      key={`${order.orderId}-${idx}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <OrderCard
                        order={order}
                        onOrderCancelled={actions.handleRefresh}
                        onViewDetail={(id) => router.push(`/orders/${id}`)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              <div
                ref={scrollRef}
                className="flex flex-col items-center justify-center"
              >
                {isFetchingNextPage ? (
                  <div className="w-full space-y-4">
                    <OrderSkeleton />
                  </div>
                ) : !hasNextPage && orders.length > 0 ? (
                  <Link href="/products">
                    <span className="flex gap-2 text-md font-bold items-center text-(--color-mainColor)">
                      <ShoppingCart size={24} />
                      Tiếp tục mua sắm
                    </span>
                  </Link>
                ) : (
                  <div className="h-10" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionPageComponents>
  );
};
export const OrdersScreen = () => (
  <OrderProvider>
    <OrdersContent />
  </OrderProvider>
);
