/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable, TextAreaField } from "@/components";
import { Column } from "@/components/DataTable/type";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
    useGetAllShops,
    useGetShopDetail,
    useGetShopStatistics,
    useVerifyShop,
    useVerifyShopLegal,
    useVerifyShopTax,
} from "../../_hooks/useManageShop";
import { GetShopRequest } from "../../_types/dto/manager.shop.dto";
import {
    colorMap,
    labelMap,
    Shop,
    ShopDetail,
    ShopStatus,
} from "../../_types/manager.shop.type";
import { ShopApprovalToolbar } from "../ShopApprovalToolbar";
import ShopDetailModal from "../ShopDetailModal";

export default function ShopApprovalForm() {
  const { handleGetAllShops, loading } = useGetAllShops();
  const { handleGetShopDetail, loading: detailLoading } = useGetShopDetail();

  const notify = (msg: string) => alert(msg);

  const [shops, setShops] = useState<Shop[]>([]);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    shop?: Shop;
  }>({ open: false });
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    shop?: ShopDetail;
  }>({ open: false });
  const [searchText, setSearchText] = useState("");
  const [detailData, setDetailData] = useState<ShopDetail | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { handleVerifyShop, loading: shopLoading } = useVerifyShop();
  const { handleVerifyShopLegal, loading: legalLoading } = useVerifyShopLegal();
  const { handleVerifyShopTax, loading: taxLoading } = useVerifyShopTax();
  const { handleGetShopStatistics } = useGetShopStatistics();
  const [statistics, setStatistics] = useState<any>(null);

  const fetchShopStatistics = async () => {
    try {
      const res = await handleGetShopStatistics();
      if (res?.data) setStatistics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchShops = async (
    status: string = activeTab,
    name: string = searchText,
    page: number = pagination.current,
    pageSize: number = pagination.pageSize
  ) => {
    const payload: GetShopRequest = {
      name: name || "",
      shopStatus: status && status !== "ALL" ? [status] : undefined,
      page: page - 1,
      size: pageSize,
      isDeleted: false,
    };
    try {
      const res = await handleGetAllShops(payload);
      if (res && res.data) {
        const mappedShops = (res.data.shops || []).map((s: any) => ({
          ...s,
          id: s.shopId,
        }));
        setShops(mappedShops);
        setPagination({
          current: page,
          pageSize,
          total: res.data.totalElements || res.data.total || 0,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchShopStatistics();
  }, []);

  useEffect(() => {
    fetchShops(activeTab, searchText, 1);
  }, [activeTab]);

  const handleResetFilters = () => {
    setSearchText("");
    setActiveTab("ALL");
    fetchShops("ALL", "", 1);
  };

  const handleRefresh = () => {
    fetchShops(activeTab, searchText, pagination.current);
    fetchShopStatistics();
  };
  const handleReject = (shop: Shop) => {
    setRejectModal({ open: true, shop });
  };

  const handleApprove = async (shopId: string) => {
    try {
      const res = await handleVerifyShop(shopId, {
        verifiedStatus: "VERIFIED",
      });
      if (res) {
        notify("Shop đã được duyệt!");
        fetchShops();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModal.shop || !rejectReason) return;
    try {
      const res = await handleVerifyShop(rejectModal.shop.shopId, {
        verifiedStatus: "REJECTED",
        reason: rejectReason,
      });
      if (res) {
        notify("Đã từ chối shop!");
        setRejectModal({ open: false });
        setRejectReason("");
        fetchShops();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDetail = async (shop: Shop) => {
    setDetailModal({ open: true, shop: shop as any });
    try {
      const data = await handleGetShopDetail(shop.shopId);
      setDetailData(data?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveLegal = async (sId: string, lId: string) => {
    await handleVerifyShopLegal(sId, lId, { verifiedStatus: "VERIFIED" });
    const res = await handleGetShopDetail(sId);
    setDetailData(res?.data);
  };

  const handleRejectLegal = async (sId: string, lId: string, r: string) => {
    await handleVerifyShopLegal(sId, lId, {
      verifiedStatus: "REJECTED",
      reason: r,
    });
    const res = await handleGetShopDetail(sId);
    setDetailData(res?.data);
  };

  const handleApproveTax = async (sId: string, tId: string) => {
    await handleVerifyShopTax(sId, tId, { verifiedStatus: "VERIFIED" });
    const res = await handleGetShopDetail(sId);
    setDetailData(res?.data);
  };

  const handleRejectTax = async (sId: string, tId: string, r: string) => {
    await handleVerifyShopTax(sId, tId, {
      verifiedStatus: "REJECTED",
      reason: r,
    });
    const res = await handleGetShopDetail(sId);
    setDetailData(res?.data);
  };

  const columns: Column<any>[] = [
    {
      header: "STT",
      render: (_, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      align: "center",
    },
    {
      header: "Thông tin Shop",
      render: (record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
            {record.logoUrl ? (
              <img
                src={record.logoUrl}
                className="w-full h-full object-cover"
                alt="logo"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600 font-semibold italic">
                SHOP
              </div>
            )}
          </div>
          <span className="truncate max-w-37.5 font-bold text-gray-700">
            {record.shopName}
          </span>
        </div>
      ),
    },
    { header: "Chủ tài khoản", accessor: "username" },
    {
      header: "Trạng thái",
      render: (record) => (
        <span
          className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase text-white shadow-sm"
          style={{ backgroundColor: colorMap[record.status as ShopStatus] }}
        >
          {labelMap[record.status as ShopStatus]}
        </span>
      ),
    },
    { header: "Người duyệt", accessor: "verifyBy" },
    {
      header: "Cập nhật",
      render: (record) =>
        record.verifyDate
          ? new Date(record.verifyDate).toLocaleDateString("vi-VN")
          : "--",
      className: "text-xs italic text-gray-600",
    },
    {
      header: "Thao tác",
      align: "right",
      render: (record) => (
        <div className="flex justify-end gap-2">
          {record.status === "PENDING" && (
            <>
              <button
                onClick={() => handleApprove(record.shopId)}
                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all font-bold text-xs uppercase"
              >
                Duyệt
              </button>
              <button
                onClick={() => setRejectModal({ open: true, shop: record })}
                className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all font-bold text-xs uppercase"
              >
                Từ chối
              </button>
            </>
          )}
          <button
            onClick={() => handleOpenDetail(record)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-all font-bold text-xs uppercase"
          >
            Chi tiết
          </button>
        </div>
      ),
    },
  ];

  const tabItems = [
    { key: "ALL", label: "Tất cả", count: statistics?.totalShops },
    { key: "PENDING", label: "Chờ duyệt", count: statistics?.byStatus.PENDING },
    {
      key: "ACTIVE",
      label: "Đang hoạt động",
      count: statistics?.byStatus.ACTIVE,
    },
    {
      key: "REJECTED",
      label: "Bị từ chối",
      count: statistics?.byStatus.REJECTED,
    },
    {
      key: "SUSPENDED",
      label: "Bị tạm khóa",
      count: statistics?.byStatus.SUSPENDED,
    },
    { key: "CLOSED", label: "Đã đóng", count: statistics?.byStatus.CLOSED },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      <ShopApprovalToolbar
        searchText={searchText}
        setSearchText={setSearchText}
        pageSize={pagination.pageSize}
        loading={loading}
        activeTab={activeTab}
        onSearch={fetchShops}
        onRefresh={handleRefresh}
        onReset={handleResetFilters}
        onPageSizeChange={(newSize) => {
          setPagination((p) => ({ ...p, pageSize: newSize, current: 1 }));
          fetchShops(activeTab, searchText, 1, newSize);
        }}
      />

      <div className="flex items-center gap-2 border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar">
        {tabItems.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-3 text-sm font-bold whitespace-nowrap transition-all relative",
              activeTab === tab.key
                ? "text-orange-500"
                : "text-gray-600 hover:text-gray-600"
            )}
          >
            {tab.label}{" "}
            <span className="opacity-60 text-xs">({tab.count ?? 0})</span>
            {activeTab === tab.key && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <DataTable
        data={shops}
        columns={columns}
        loading={loading}
        page={pagination.current - 1}
        size={pagination.pageSize}
        totalElements={pagination.total}
        onPageChange={(newPage) =>
          fetchShops(activeTab, searchText, newPage + 1)
        }
      />

      <PortalModal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false })}
        title={`Từ chối Shop: ${rejectModal.shop?.shopName}`}
      >
        <div className="space-y-4">
          <TextAreaField
            name="rejectReason"
            rows={3}
            maxLength={500}
            label="Lý do từ chối"
            placeholder="Nhập lý do chi tiết để người bán chỉnh sửa..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setRejectModal({ open: false })}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-all"
            >
              Hủy
            </button>
            <button
              disabled={!rejectReason.trim()}
              onClick={handleConfirmReject}
              className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-50"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </PortalModal>

      <ShopDetailModal
        open={detailModal.open}
        shop={detailModal.shop}
        detailData={detailData}
        loading={detailLoading}
        taxLoading={taxLoading}
        legalLoading={legalLoading}
        onClose={() => setDetailModal({ open: false })}
        onApproveLegal={handleApproveLegal}
        onRejectLegal={handleRejectLegal}
        onApproveTax={handleApproveTax}
        onRejectTax={handleRejectTax}
      />
    </div>
  );
}
