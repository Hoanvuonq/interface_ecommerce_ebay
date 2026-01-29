"use client";

import { StatusTabs } from "@/app/(shop)/shop/_components/Products/StatusTabs";
import {
  ButtonField,
  DataTable,
  FormInput,
  SelectComponent,
  StatCardComponents,
} from "@/components";
import { PortalModal } from "@/features/PortalModal";
import {
  AlertCircle,
  Clock,
  LayoutList,
  RotateCw,
  Search,
  Store,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SHOP_STATUS_TABS } from "../../_constants/tabs.constants";
import {
  useGetAllShops,
  useGetShopDetail,
  useGetShopStatistics,
  useVerifyShop,
  useVerifyShopLegal,
  useVerifyShopTax,
} from "../../_hooks/useManageShop";
import { GetShopRequest } from "../../_types/dto/manager.shop.dto";
import { Shop, ShopDetail } from "../../_types/manager.shop.type";
import { ShopDetailModal } from "../ShopDetailModal";
import { getShopColumns } from "./colum";
import { RejectShopModal } from "../RejectShopModal";

export default function ShopApprovalForm() {
  const { handleGetAllShops, loading } = useGetAllShops();
  const { handleGetShopDetail, loading: detailLoading } = useGetShopDetail();

  const [shops, setShops] = useState<Shop[]>([]);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchText, setSearchText] = useState("");
  const [statistics, setStatistics] = useState<any>(null);
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    shop?: Shop;
  }>({ open: false });
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    shop?: ShopDetail;
  }>({ open: false });
  const [detailData, setDetailData] = useState<ShopDetail | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const notify = (msg: string) => alert(msg);
  const { handleVerifyShop } = useVerifyShop();
  const { handleVerifyShopLegal, loading: legalLoading } = useVerifyShopLegal();
  const { handleVerifyShopTax, loading: taxLoading } = useVerifyShopTax();
  const { handleGetShopStatistics } = useGetShopStatistics();

  const fetchShopStatistics = async () => {
    const res = await handleGetShopStatistics();
    if (res?.data) setStatistics(res.data);
  };
  const handleConfirmReject = async (reason: string) => {
    if (!rejectModal.shop) return;
    try {
      const res = await handleVerifyShop(rejectModal.shop.shopId, {
        verifiedStatus: "REJECTED",
        reason: reason,
      });
      if (res) {
        notify("Đã từ chối shop!");
        setRejectModal({ open: false });
        fetchShops();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchShops = async (
    status: string = activeTab,
    name: string = searchText,
    page: number = pagination.current,
  ) => {
    const payload: GetShopRequest = {
      name: name || "",
      shopStatus: status !== "ALL" ? [status as any] : undefined,
      page: page - 1,
      size: pagination.pageSize,
      isDeleted: false,
    };

    const res = await handleGetAllShops(payload);
    if (res && res.data) {
      const dataList = res.data.content || res.data.shops || [];
      setShops(dataList.map((s: any) => ({ ...s, id: s.shopId })));
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: res.data.totalElements || 0,
      }));
    }
  };

  useEffect(() => {
    fetchShops();
    fetchShopStatistics();
  }, [activeTab, pagination.pageSize]);

  const columns = useMemo(
    () =>
      getShopColumns({
        page: pagination.current - 1,
        size: pagination.pageSize,
        onApprove: async (id) => {
          if (confirm("Duyệt shop này?")) {
            await handleVerifyShop(id, { verifiedStatus: "VERIFIED" });
            fetchShops();
          }
        },
        onReject: (shop) => setRejectModal({ open: true, shop }),
        onView: (shop) => handleOpenDetail(shop),
      }),
    [pagination.current, pagination.pageSize],
  );

  const handleOpenDetail = async (shop: Shop) => {
    setDetailModal({ open: true, shop: shop as any });
    const data = await handleGetShopDetail(shop.shopId);
    setDetailData(data?.data);
  };

  const tabItems = useMemo(() => {
    return SHOP_STATUS_TABS.map((tab) => {
      let count = 0;

      if (tab.key === "ALL") {
        count = statistics?.totalShops || 0;
      } else {
        count = statistics?.byStatus?.[tab.key] || 0;
      }

      return {
        ...tab,
        count,
      };
    });
  }, [statistics]);
  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <StatusTabs
          tabs={tabItems}
          current={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setPagination((p) => ({ ...p, current: 1 }));
          }}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              fetchShops(activeTab, searchText, pagination.current)
            }
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-90"
          >
            <RotateCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-9 relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
            size={18}
          />
          <FormInput
            placeholder="Tìm kiếm tên shop, ID cửa hàng..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchShops()}
            className="pl-12 h-12 bg-gray-50/80 rounded-2xl border-transparent focus:bg-white transition-all shadow-sm font-bold"
          />
        </div>
        <div className="md:col-span-3">
          <SelectComponent
            options={[10, 20, 50].map((v) => ({
              label: `Hiện ${v} dòng`,
              value: String(v),
            }))}
            value={String(pagination.pageSize)}
            onChange={(v) =>
              setPagination((p) => ({ ...p, pageSize: Number(v), current: 1 }))
            }
            className="rounded-2xl h-12 shadow-sm"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-4 animate-in fade-in duration-700 p-2">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-3xl shadow-orange-100 shadow-lg">
          <Store size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tighter uppercase italic leading-none">
            Duyệt <span className="text-orange-500">Cửa hàng</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-2">
            Hệ thống phê duyệt người bán
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng yêu cầu"
          value={statistics?.totalShops || 0}
          color="text-gray-900"
          icon={<LayoutList />}
          trend={12}
        />
        <StatCardComponents
          label="Đang chờ duyệt"
          value={statistics?.byStatus.PENDING || 0}
          color="text-orange-500"
          icon={<Clock />}
          trend={10}
        />
        <StatCardComponents
          label="Shop hoạt động"
          value={statistics?.byStatus.ACTIVE || 0}
          color="text-emerald-500"
          icon={<Store />}
          trend={12}
        />
      </div>

      <div className="bg-white rounded-4xl p-4 border border-gray-100 shadow-custom overflow-hidden">
        <DataTable
          data={shops}
          columns={columns}
          loading={loading}
          rowKey="shopId"
          page={pagination.current - 1}
          size={pagination.pageSize}
          totalElements={pagination.total}
          onPageChange={(p) => fetchShops(activeTab, searchText, p + 1)}
          headerContent={tableHeader}
        />
      </div>

      <RejectShopModal
        isOpen={rejectModal.open}
        shopName={rejectModal.shop?.shopName}
        onClose={() => setRejectModal({ open: false })}
        onConfirm={handleConfirmReject}
        isLoading={loading}
      />

      <ShopDetailModal
        open={detailModal.open}
        shop={detailModal.shop}
        detailData={detailData}
        loading={detailLoading}
        taxLoading={taxLoading}
        legalLoading={legalLoading}
        onClose={() => setDetailModal({ open: false })}
        onApproveLegal={async (s, l) => {
          await handleVerifyShopLegal(s, l, { verifiedStatus: "VERIFIED" });
          handleOpenDetail(shops.find((x) => x.shopId === s)!);
        }}
        onRejectLegal={async (s, l, r) => {
          await handleVerifyShopLegal(s, l, {
            verifiedStatus: "REJECTED",
            reason: r,
          });
          handleOpenDetail(shops.find((x) => x.shopId === s)!);
        }}
        onApproveTax={async (s, t) => {
          await handleVerifyShopTax(s, t, { verifiedStatus: "VERIFIED" });
          handleOpenDetail(shops.find((x) => x.shopId === s)!);
        }}
        onRejectTax={async (s, t, r) => {
          await handleVerifyShopTax(s, t, {
            verifiedStatus: "REJECTED",
            reason: r,
          });
          handleOpenDetail(shops.find((x) => x.shopId === s)!);
        }}
      />
    </div>
  );
}
