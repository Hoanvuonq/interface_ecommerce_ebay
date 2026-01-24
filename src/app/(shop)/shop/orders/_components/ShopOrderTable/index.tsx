"use client";

import {
  OrderStatus,
  ShopOrderResponse,
  ShopOrderStatusUpdateRequest
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import { DataTable } from "@/components";
import { useToast } from "@/hooks/useToast";
import {
  CircleDollarSign,
  Clock,
  ShoppingBag,
  Truck
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { SmartKPICard } from "../../../_components";
import { StatusTabs } from "../../../_components/Products/StatusTabs";
import { useUpdateShopOrderStatus } from "../../../marketing/vouchers/_hooks/useShopOrder";
import { renderStatus } from "../../_constants/getStatus";
import { getOrderTabs } from "../../_constants/tabsRender";
import { useShopOrderManager } from "../../_hooks/useShopOrderManager";
import { OrderDetailModal } from "../OrderDetailModal";
import { ShopOrderFilters } from "../ShopOrderFilters";
import { UpdateStatusModal } from "../UpdateStatusModal";
import { getOrderColumns } from "./column";


export default function ShopOrderTable() {
  const { success: toastSuccess, error: toastError } = useToast();
  const { state, actions } = useShopOrderManager();
  const clickLockRef = useRef(false);
  const lastPageRef = useRef<number>(-1);

  const { handleUpdateShopOrderStatus, loading: statusUpdateLoading } =
    useUpdateShopOrderStatus();
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ShopOrderResponse | null>(
    null,
  );

  const getDeadlineInfo = (order: ShopOrderResponse) => {
    const created = order.createdAt
      ? new Date(order.createdAt).getTime()
      : Date.now();
    const deadlineMs = created + 48 * 60 * 60 * 1000;
    const diff = deadlineMs - Date.now();
    const abs = Math.abs(diff);
    const hours = Math.floor(abs / 3600000);
    const mins = Math.floor((abs % 3600000) / 60000);

    const isOverdue = diff < 0;
    return {
      text: isOverdue ? `Trễ ${hours}h${mins}m` : `${hours}h${mins}m`,
      color: isOverdue
        ? "text-red-500 bg-red-50 border-red-100"
        : diff <= 3600000
          ? "text-orange-500 bg-orange-50 border-orange-100"
          : "text-emerald-500 bg-emerald-50 border-emerald-100",
      isOverdue,
    };
  };
  const handleOpenDetail = async (record: ShopOrderResponse) => {
    const res = await actions.handleGetShopOrderById(record.orderId);
    if (res?.success) {
      setSelectedOrder(res.data);
      setDetailModalVisible(true);
    }
  };

  const columns = useMemo(
    () =>
      getOrderColumns(
        actions,
        renderStatus,
        getDeadlineInfo,
        handleOpenDetail,
        (record) => {
          setSelectedOrder(record);
          setStatusModalVisible(true);
        },
      ),
    [actions],
  );

  // ==================== HANDLERS ====================
  const handleStatusFormSubmit = async (values: any) => {
    if (!selectedOrder) return;
    try {
      const payload: ShopOrderStatusUpdateRequest = {
        status: values.status,
        note: values.note,
        ...(values.status === OrderStatus.SHIPPED && values.carrier
          ? { carrier: values.carrier }
          : {}),
      };
      const res = await handleUpdateShopOrderStatus(
        selectedOrder.orderId,
        payload,
      );
      if (res?.success) {
        toastSuccess("Cập nhật trạng thái thành công");
        setStatusModalVisible(false);
        actions.refreshData(
          state.pagination.current,
          state.pagination.pageSize,
        );
      }
    } catch (error) {
      toastError("Lỗi cập nhật trạng thái");
    }
  };

  const orderTabsExtended = useMemo(
    () => getOrderTabs(state.statistics),
    [state.statistics],
  );

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-10 animate-in fade-in duration-700 ">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-orange-500 rounded-[1.2rem] shadow-xl shadow-orange-200">
              <ShoppingBag size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tighter italic leading-none">
                Quản Lý <span className="text-orange-500">Đơn Hàng</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 ml-1">
                Commerce Management Protocol v4.0
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {[
          {
            title: "Tổng đơn hàng",
            value: state.statistics.total,
            icon: <ShoppingBag size={20} />,
            colorTheme: "blue",
          },
          {
            title: "Chờ thanh toán",
            value: state.statistics.awaitingPayment,
            icon: <CircleDollarSign size={20} />,
            colorTheme: "orange",
          },
          {
            title: "Chờ xác nhận",
            value: state.statistics.pendingConfirm,
            icon: <Clock size={20} />,
            colorTheme: "purple",
          },
          {
            title: "Cần giao hàng",
            value: state.statistics.readyToShip,
            icon: <Truck size={20} />,
            colorTheme: "green",
          },
        ].map((card, idx) => (
          <div key={idx} className="col-span-12 md:col-span-6 lg:col-span-3">
            <SmartKPICard
              title={card.title}
              value={card.value}
              icon={card.icon}
              colorTheme={card.colorTheme as any}
              loading={state.isInitialLoading}
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <StatusTabs
          tabs={orderTabsExtended}
          current={state.activeTab}
          onChange={(key) => actions.setActiveTab(key)}
        />

        <div className=" rounded-[2.5rem] border border-orange-50 shadow-custom-lg overflow-hidden p-2">
          <DataTable
            columns={columns}
            data={state.orders}
            loading={state.isInitialLoading}
            totalElements={state.pagination.total}
            page={state.pagination.current - 1} // Trang 0-based
            size={state.pagination.pageSize}
            onPageChange={(p) => {
              if (lastPageRef.current !== p) {
                lastPageRef.current = p;
                const newPage = p + 1; // Convert về 1-based
                actions.refreshData(newPage, state.pagination.pageSize);
              }
            }}
            headerContent={
              <ShopOrderFilters
                dateRange={state.dateRange}
                setDateRange={actions.setDateRange}
                searchText={state.searchText}
                setSearchText={actions.setSearchText}
                carrierFilter={state.carrierFilter}
                setCarrierFilter={actions.setCarrierFilter}
                processingFilter={state.processingFilter}
                setProcessingFilter={actions.setProcessingFilter}
                orderTypeFilter={state.orderTypeFilter}
                setOrderTypeFilter={actions.setOrderTypeFilter}
                sortOption={state.sortOption}
                setSortOption={actions.setSortOption}
                handleResetFilters={() => {
                  actions.setDateRange([null, null]);
                  actions.setSearchText("");
                  actions.setCarrierFilter(undefined);
                }}
                onSearch={() =>
                  actions.refreshData(1, state.pagination.pageSize)
                }
              />
            }
          />
        </div>
      </div>

      {/* Modals */}
      <UpdateStatusModal
        isOpen={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        isLoading={statusUpdateLoading}
        onSubmit={handleStatusFormSubmit}
        initialValues={{
          status: selectedOrder?.status as OrderStatus,
          note: "",
        }}
      />

      <OrderDetailModal
        isOpen={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        order={selectedOrder}
        renderStatus={renderStatus}
      />
    </div>
  );
}
