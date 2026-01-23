"use client";

import { cn } from "@/utils/cn";
import { Clock, Filter, Package, ShoppingBag, Truck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  FilterCounts,
  OrderStatus,
  ShopOrderResponse,
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import {
  useBulkReadyForPickup,
  useGetPendingShipmentOrders,
} from "../../../marketing/vouchers/_hooks/useShopOrder";
import { CARRIER_OPTIONS } from "../_constants/carrier.option.constants";

import { DataTable } from "@/components";
import { useToast } from "@/hooks/useToast";
import {
  StatusTabItem,
  StatusTabs,
} from "../../../_components/Products/StatusTabs";
import { HandoverSidebar } from "../_components/HandoverSidebar";
import { getHandoverColumns } from "../_constants/column.oders.handover";
export const HandoverScreen = () => {
  const {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
  } = useToast();

  const [orders, setOrders] = useState<ShopOrderResponse[]>([]);
  const [filterCounts, setFilterCounts] = useState<FilterCounts | null>(null);
  const isFetching = useRef(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [carrierFilter, setCarrierFilter] = useState<string>("ALL");
  const [deadlineFilter, setDeadlineFilter] = useState<string>("ALL");
  const [pickupMethod, setPickupMethod] = useState<"PICKUP" | "DROPOFF">(
    "PICKUP",
  );
  const [page, setPage] = useState(0);

  const { handleGetPendingShipmentOrders, loading } =
    useGetPendingShipmentOrders();
  const { handleBulkReadyForPickup, loading: bulkLoading } =
    useBulkReadyForPickup();

  const fetchOrders = async () => {
  if (isFetching.current) return; 
  isFetching.current = true;
  
  try {
    const params: any = {};
    if (carrierFilter !== "ALL") params.carrier = carrierFilter;
    if (deadlineFilter !== "ALL") params.deadline = deadlineFilter;

    const res = await handleGetPendingShipmentOrders({
      ...params,
      page,
      size: 10,
    });
    
    if (res?.success && res.data) {
      setOrders(res.data.orders || []);
      setFilterCounts(res.data.filterCounts || null);
    }
  } finally {
    isFetching.current = false;
  }
};

  useEffect(() => {
    fetchOrders();
  }, [carrierFilter, deadlineFilter, page]);

  const fulfillingOrders = useMemo(
    () => orders.filter((o) => o.status === OrderStatus.FULFILLING),
    [orders],
  );

  // Logic chọn tất cả checkbox
  const isAllSelected =
    fulfillingOrders.length > 0 &&
    selectedRowKeys.length === fulfillingOrders.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(fulfillingOrders.map((o) => o.orderId));
    }
  };

  const handleSelectRow = (orderId: string) => {
    setSelectedRowKeys((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const carrierStats = useMemo(() => {
    const stats: Record<string, number> = {};
    orders.forEach((o) => {
      const c = o.carrier || "NO_CARRIER";
      stats[c] = (stats[c] || 0) + 1;
    });
    return stats;
  }, [orders]);

  const handleBulkPickup = async () => {
    if (selectedRowKeys.length === 0) {
      toastWarning("Chọn ít nhất 1 đơn để yêu cầu lấy hàng");
      return;
    }

    const res = await handleBulkReadyForPickup({
      orderIds: selectedRowKeys,
      pickupMethod,
      note: pickupMethod === "PICKUP" ? "Yêu cầu ĐVVC đến lấy" : "Shop tự gửi",
    });

    if (res?.success) {
      toastSuccess(`Thành công: ${res.data.successCount} đơn`);
      setSelectedRowKeys([]);
      fetchOrders();
    }
  };

  const deadlineTabs: StatusTabItem<string>[] = [
    { key: "ALL", label: "Tất cả", icon: Package, count: filterCounts?.total },
    {
      key: "OVERDUE",
      label: "Quá hạn",
      icon: Clock,
      count: filterCounts?.overdue,
    },
    {
      key: "WITHIN_24H",
      label: "Trong 24h",
      icon: Filter,
      count: filterCounts?.within24h,
    },
    {
      key: "OVER_24H",
      label: "Trên 24h",
      icon: Filter,
      count: filterCounts?.over24h,
    },
  ];
  const columns = useMemo(
    () =>
      getHandoverColumns({
        selectedRowKeys,
        handleSelectAll,
        handleSelectRow,
        isAllSelected,
      }),
    [selectedRowKeys, isAllSelected],
  );

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-orange-500 rounded-[1.2rem] shadow-xl shadow-orange-200">
              <ShoppingBag size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tighter italic leading-none">
                Bàn Giao <span className="text-orange-500">Đơn Hàng</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 ml-1">
                Commerce Management Protocol
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="bg-white p-4 rounded-4xl border border-gray-100 shadow-sm space-y-4">
            <StatusTabs
              tabs={deadlineTabs}
              current={deadlineFilter}
              onChange={setDeadlineFilter}
            />
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
              <button
                onClick={() => setCarrierFilter("ALL")}
                className={cn(
                  "px-4 py-2 rounded-xl text-[11px] font-bold uppercase transition-all",
                  carrierFilter === "ALL"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100",
                )}
              >
                Tất cả ĐVVC
              </button>
              {CARRIER_OPTIONS.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCarrierFilter(c.code)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-[12px] font-bold uppercase transition-all border",
                    carrierFilter === c.code
                      ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                      : "border-gray-100 bg-white text-gray-400 hover:border-gray-300",
                  )}
                >
                  {c.label} ({carrierStats[c.code] || 0})
                </button>
              ))}
            </div>
          </div>

          <DataTable
            data={orders}
            columns={columns}
            loading={loading || bulkLoading}
            rowKey="orderId"
            page={page}
            size={10}
            totalElements={filterCounts?.total || 0}
            onPageChange={setPage}
            headerContent={
              <div className="flex items-center justify-between w-full px-4 py-2">
                <span className="text-[13px] font-bold text-gray-500 italic">
                  {selectedRowKeys.length > 0
                    ? `Đang chọn ${selectedRowKeys.length} đơn hàng`
                    : `${orders.length} đơn hàng có thể bàn giao`}
                </span>

                <button
                  onClick={handleBulkPickup}
                  disabled={selectedRowKeys.length === 0 || bulkLoading}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                    selectedRowKeys.length > 0
                      ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600 active:scale-95"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed",
                  )}
                >
                  <Truck size={14} />
                  Yêu cầu lấy hàng ({selectedRowKeys.length})
                </button>
              </div>
            }
          />
        </div>

        <div className="w-full lg:w-[320px] shrink-0">
          <HandoverSidebar
            selectedCount={selectedRowKeys.length}
            pickupMethod={pickupMethod}
            setPickupMethod={setPickupMethod}
            onConfirm={handleBulkPickup}
            isLoading={bulkLoading}
          />
        </div>
      </div>
    </div>
  );
};
