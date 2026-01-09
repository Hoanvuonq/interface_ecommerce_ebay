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
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 my-4 animate-in fade-in zoom-in duration-500">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center shadow-inner">
                  <Inbox
                    size={48}
                    strokeWidth={1.5}
                    className="text-gray-300"
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
                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider leading-relaxed">
                  Chúng tôi không tìm thấy bất kỳ đơn hàng nào khớp với yêu cầu
                  của bạn.
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
