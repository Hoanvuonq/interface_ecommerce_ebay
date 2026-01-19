"use client";

import {
  ORDER_STATUS_TEXT,
  OrderStatus,
  ShopOrderResponse,
  ShopOrderStatusUpdateRequest,
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import { ActionBtn, DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import {
  CircleDollarSign,
  Clock,
  Edit3,
  Eye,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useMemo, useState, useRef } from "react";
import { SmartKPICard } from "../../../_components";
import { StatusTabs } from "../../../_components/Products/StatusTabs";
import { useUpdateShopOrderStatus } from "../../../vouchers/_hooks/useShopOrder";
import { getOrderTabs } from "../../_constants/tabsRender";
import { useShopOrderManager } from "../../_hooks/useShopOrderManager";
import { OrderDetailModal } from "../OrderDetailModal";
import { ShopOrderFilters } from "../ShopOrderFilters";
import { UpdateStatusModal } from "../UpdateStatusModal";
import Image from "next/image";

export default function ShopOrderTable() {
  const { success: toastSuccess, error: toastError } = useToast();

  const { state, actions } = useShopOrderManager();

  const clickLockRef = useRef(false);
  const setClickLock = (value: boolean, delay = 500) => {
    clickLockRef.current = value;
    if (value) {
      setTimeout(() => {
        clickLockRef.current = false;
      }, delay);
    }
  };

  const { handleUpdateShopOrderStatus, loading: statusUpdateLoading } =
    useUpdateShopOrderStatus();
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ShopOrderResponse | null>(
    null
  );

  const renderStatus = (status: OrderStatus) => {
    const configs: Record<OrderStatus, string> = {
      [OrderStatus.CREATED]: "bg-gray-100 text-gray-600 border-gray-200",
      [OrderStatus.AWAITING_PAYMENT]:
        "bg-amber-100 text-amber-700 border-amber-200",
      [OrderStatus.PAID]: "bg-blue-100 text-blue-700 border-blue-200",
      [OrderStatus.FULFILLING]: "bg-cyan-100 text-cyan-700 border-cyan-200",
      [OrderStatus.READY_FOR_PICKUP]:
        "bg-violet-100 text-violet-700 border-violet-200",
      [OrderStatus.SHIPPED]: "bg-indigo-100 text-indigo-700 border-indigo-200",
      [OrderStatus.OUT_FOR_DELIVERY]: "bg-sky-100 text-sky-700 border-sky-200",
      [OrderStatus.DELIVERED]:
        "bg-emerald-100 text-emerald-700 border-emerald-200",
      [OrderStatus.CANCELLED]: "bg-red-100 text-red-700 border-red-200",
      [OrderStatus.REFUNDING]: "bg-pink-100 text-pink-700 border-pink-200",
      [OrderStatus.REFUNDED]: "bg-rose-100 text-rose-700 border-rose-200",
    };
    return (
      <span
        className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border shadow-sm",
          configs[status]
        )}
      >
        {ORDER_STATUS_TEXT[status] || status}
      </span>
    );
  };

  const getDeadlineInfo = (order: ShopOrderResponse) => {
    const created = order.createdAt
      ? new Date(order.createdAt).getTime()
      : Date.now();
    const deadlineMs = created + 48 * 60 * 60 * 1000;
    const diff = deadlineMs - Date.now();
    const abs = Math.abs(diff);
    const hours = Math.floor(abs / 3600000);
    const mins = Math.floor((abs % 3600000) / 60000);
    const text =
      diff < 0 ? `Quá hạn ${hours}h${mins}m` : `Còn ${hours}h${mins}m`;
    const color =
      diff < 0
        ? "text-red-600 bg-red-50"
        : diff <= 3600000
        ? "text-orange-600 bg-orange-50"
        : "text-emerald-600 bg-emerald-50";
    return { text, color };
  };

  // ==================== DATA TABLE COLUMNS ====================
  const columns: Column<ShopOrderResponse>[] = [
    {
      header: "Sản phẩm",
      render: (record) => {
        const first = record.items?.[0];
        const img =
          first?.imageBasePath && first?.imageExtension
            ? toPublicUrl(
                toSizedVariant(
                  `${first.imageBasePath}${first.imageExtension}`,
                  "_thumb"
                )
              )
            : "";
        return (
          <div className="flex items-center gap-3 min-w-50">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50 flex items-center justify-center">
              {img ? (
                <Image
                  src={img}
                  alt={first?.productName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-[10px] font-bold text-center">
                  N/A
                </span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-gray-800 text-sm truncate leading-tight">
                {first?.productName || "—"}
              </span>
              {record.items && record.items.length > 1 && (
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                  +{record.items.length - 1} sản phẩm khác
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "Mã đơn hàng",
      render: (record) => (
        <span className="font-bold text-gray-900 tracking-tighter italic text-xs uppercase">
          {record.orderNumber}
        </span>
      ),
    },
    {
      header: "Thanh toán",
      align: "center",
      render: (record) => (
        <span
          className={cn(
            "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm border",
            record.paymentMethod === "COD"
              ? "bg-orange-50 text-orange-600 border-gray-100"
              : "bg-blue-50 text-blue-600 border-blue-100"
          )}
        >
          {record.paymentMethod}
        </span>
      ),
    },
    {
      header: "Tổng tiền",
      align: "right",
      render: (record) => (
        <span className="font-bold text-blue-600 text-sm italic">
          {new Intl.NumberFormat("vi-VN").format(record.grandTotal)} ₫
        </span>
      ),
    },
    {
      header: "Trạng thái",
      align: "center",
      render: (record) => renderStatus(record.status as OrderStatus),
    },
    {
      header: "Hạn gửi",
      render: (record) => {
        const info = getDeadlineInfo(record);
        return (
          <div
            className={cn(
              "px-3 py-1 rounded-xl border text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-tighter",
              info.color
            )}
          >
            <Clock size={12} /> {info.text}
          </div>
        );
      },
    },
    {
      header: "Thao tác",
      align: "right",
     render: (record) => {
      // Logic kiểm tra trạng thái để hiển thị nút tương ứng
      const canConfirm = record.status === OrderStatus.CREATED || record.status === OrderStatus.PAID;
      const canShip = record.status === OrderStatus.FULFILLING;
      const isFinished = [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.REFUNDED].includes(record.status as OrderStatus);

      const handleView = async () => {
        if (clickLockRef.current) return;
        clickLockRef.current = true;
        const res = await actions.handleGetShopOrderById(record.orderId);
        if (res?.success) {
          setSelectedOrder(res.data);
          setDetailModalVisible(true);
        }
        clickLockRef.current = false;
      };

      return (
        <div className="flex items-center justify-end gap-1.5">
          {/* Nút Xem chi tiết - Luôn hiện */}
          <ActionBtn 
            onClick={handleView}
            icon={<Eye size={18} />}
            color="text-blue-500 hover:bg-blue-50"
          />

          {/* Nút Xác nhận - Chỉ hiện khi chờ xác nhận */}
          {canConfirm && (
            <ActionBtn 
              label="Xác nhận"
              onClick={() => actions.handleQuickAction(record.orderId, OrderStatus.FULFILLING, "Xác nhận đơn hàng")}
              color="bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
            />
          )}

          {/* Nút Giao Shipper - Màu xanh lá như ảnh 6 */}
          {canShip && (
            <ActionBtn 
              label="Giao shipper"
              onClick={() => actions.handleQuickAction(record.orderId, OrderStatus.SHIPPED, "Đã giao cho đơn vị vận chuyển")}
              color="bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200"
            />
          )}

          {/* Nút Cập nhật (Icon Bút chì) - Chỉ hiện khi chưa hoàn tất */}
          {!isFinished && (
            <ActionBtn 
              onClick={() => {
                setSelectedOrder(record);
                setStatusModalVisible(true);
              }}
              icon={<Edit3 size={18} />}
              color="text-orange-500 hover:bg-orange-50"
            />
          )}
        </div>
      );
    }
  }
];

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
        payload
      );
      if (res?.success) {
        toastSuccess("Cập nhật trạng thái thành công");
        setStatusModalVisible(false);
        // Sync data using actions from hook
        actions.refreshData(
          state.pagination.current,
          state.pagination.pageSize
        );
      }
    } catch (error) {
      console.error(error);
      toastError("Lỗi cập nhật trạng thái");
    }
  };

  const orderTabsExtended = useMemo(
    () => getOrderTabs(state.statistics),
    [state.statistics]
  );

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1 px-2 border-l-4 border-gray-500 pl-6">
        <h1 className="text-3xl font-bold text-gray-900 italic uppercase tracking-tighter">
          Quản lý đơn hàng
        </h1>
        <p className="text-sm text-gray-500 font-medium italic">
          Vận hành và kiểm soát dòng hàng kinh doanh
        </p>
      </div>

      <div className="grid grid-cols-12 gap-5">
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

      <div className="space-y-6">
        <StatusTabs
          tabs={orderTabsExtended}
          current={state.activeTab}
          onChange={(key) => actions.setActiveTab(key)}
        />

        <DataTable
          columns={columns}
          data={state.orders}
          loading={state.isInitialLoading}
          totalElements={state.pagination.total}
          page={state.pagination.current - 1}
          size={state.pagination.pageSize}
          onPageChange={(p) =>
            actions.refreshData(p + 1, state.pagination.pageSize)
          }
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
              onSearch={() => actions.refreshData(1, state.pagination.pageSize)}
            />
          }
        />
      </div>

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
