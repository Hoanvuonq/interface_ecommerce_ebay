/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { VoucherTemplate } from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { ButtonField, DataTable, SelectComponent } from "@/components"; // Dùng SelectComponent của bạn
import { formatCurrency } from "@/hooks/format";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import {
  Copy,
  Edit3,
  Eraser,
  Eye,
  MoreVertical,
  Plus,
  Power,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  Trash2,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SmartKPICard } from "../../../_components";
import {
  useDeleteVoucher,
  useDuplicateVoucher,
  useSearchVoucherTemplates,
  useToggleVoucherActive,
} from "../../_hooks/useShopVoucher";
import ShopVoucherCreateModal from "../Modals/ShopVoucherCreateModal";
import ShopVoucherDetailModal from "../Modals/ShopVoucherDetailModal";
import ShopVoucherEditModal from "../Modals/ShopVoucherEditModal";
import ShopVoucherPurchaseModal from "../Modals/ShopVoucherPurchaseModal";
import { StatusTabsTable } from "../StatusTabsTable";

type VoucherScope = "all" | "shop" | "platform" | "applicableForShop";

export default function ShopVoucherList() {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState<VoucherScope>("shop");
  const [vouchers, setVouchers] = useState<VoucherTemplate[]>([]);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [stats, setStats] = useState({
    totalVouchers: 0,
    shopVouchers: 0,
    platformVouchers: 0,
    applicableVouchers: 0,
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] =
    useState<VoucherTemplate | null>(null);

  const { searchTemplates, loading } = useSearchVoucherTemplates();
  const { handleDelete } = useDeleteVoucher();
  const { handleToggle } = useToggleVoucherActive();
  const { handleDuplicate } = useDuplicateVoucher();

  const pageSizeOptions = [
    { label: "10 mục", value: "10" },
    { label: "20 mục", value: "20" },
    { label: "50 mục", value: "50" },
  ];

  const fetchStatistics = async () => {
    const [all, shop, platform, applicable] = await Promise.all([
      searchTemplates({ scope: "all", page: 0, size: 1 }),
      searchTemplates({ scope: "shop", page: 0, size: 1 }),
      searchTemplates({ scope: "platform", page: 0, size: 1 }),
      searchTemplates({ scope: "applicableForShop", page: 0, size: 1 }),
    ]);
    setStats({
      totalVouchers: all?.data?.totalElements || 0,
      shopVouchers: shop?.data?.totalElements || 0,
      platformVouchers: platform?.data?.totalElements || 0,
      applicableVouchers: applicable?.data?.totalElements || 0,
    });
  };

  const fetchVouchers = async (
    page: number = 1,
    scope = activeTab,
    search = searchText,
    pageSize = pagination.pageSize
  ) => {
    const result = await searchTemplates({
      scope,
      page: page - 1,
      size: pageSize,
      q: search || undefined,
      sort: "createdDate,desc",
    });
    if (result?.data) {
      setVouchers(result.data.content);
      setPagination({
        current: result.data.page + 1,
        pageSize: result.data.size,
        total: result.data.totalElements,
      });
    }
  };
  const handleResetFilters = () => {
    setSearchText("");
    setActiveTab("shop");
    setPagination({ current: 1, pageSize: 10, total: 0 });
    fetchVouchers(1, "shop", "");
  };
  const handleRefresh = () => {
    fetchStatistics();
    fetchVouchers(pagination.current, activeTab, searchText);
  };

  useEffect(() => {
    fetchStatistics();
    fetchVouchers(1, activeTab);
  }, [activeTab]);

  const columns = useMemo(
    () => [
      {
        header: "Voucher",
        className: "min-w-[250px]",
        render: (item: VoucherTemplate) => (
          <div className="flex flex-col gap-1">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold w-fit rounded-lg tracking-widest font-mono border border-blue-100 uppercase">
              {item.code}
            </span>
            <span className="text-sm font-bold text-gray-800 line-clamp-1">
              {item.name}
            </span>
          </div>
        ),
      },
      {
        header: "Ưu đãi",
        align: "center" as const,
        render: (item: VoucherTemplate) => (
          <span
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-tight shadow-sm border",
              item.discountMethod === "FIXED_AMOUNT"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-orange-50 text-orange-700 border-orange-100"
            )}
          >
            {item.discountMethod === "FIXED_AMOUNT"
              ? formatCurrency(item.discountValue)
              : `${item.discountValue}%`}
          </span>
        ),
      },
      {
        header: "Loại",
        align: "center" as const,
        render: (item: VoucherTemplate) => (
          <span
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest",
              item.creatorType === "SHOP"
                ? "bg-purple-100 text-purple-700"
                : "bg-cyan-100 text-cyan-700"
            )}
          >
            {item.creatorType === "SHOP" ? "Shop" : "Sàn"}
          </span>
        ),
      },
      {
        header: "Trạng thái",
        align: "center" as const,
        render: (item: VoucherTemplate) => (
          <div className="flex items-center justify-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                item.active ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
              )}
            />
            <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
              {item.active ? "Online" : "Offline"}
            </span>
          </div>
        ),
      },
      {
        header: "Hành động",
        align: "right" as const,
        render: (item: VoucherTemplate) => {
          const isShopVoucher = item.creatorType === "SHOP";
          return (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedVoucher(item);
                  setDetailModalOpen(true);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200"
              >
                <Eye size={18} />
              </button>
              {isShopVoucher ? (
                <button
                  onClick={() => {
                    setSelectedVoucher(item);
                    setEditModalOpen(true);
                  }}
                  className="p-2 hover:bg-orange-50 rounded-xl transition-all text-gray-400 hover:text-orange-600 border border-transparent hover:border-orange-100"
                >
                  <Edit3 size={18} />
                </button>
              ) : (
                item.purchasable && (
                  <button
                    onClick={() => {
                      setSelectedVoucher(item);
                      setPurchaseModalOpen(true);
                    }}
                    className="p-2 bg-gray-900 text-white rounded-xl hover:bg-orange-500 transition-all shadow-lg active:scale-90"
                  >
                    <ShoppingCart size={18} />
                  </button>
                )
              )}

              {isShopVoucher && (
                <div className="relative group">
                  <button className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400">
                    <MoreVertical size={18} />
                  </button>
                  {/* Dropdown custom thay antd: 
                    Bạn có thể dùng component Popover custom hoặc đơn giản là Tailwind group-hover 
                 */}
                  <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-50 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => handleDuplicateAction(item.id)}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Copy /> Sao chép
                    </button>
                    <button
                      onClick={() => handleToggleAction(item.id)}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Power /> {item.active ? "Tắt" : "Bật"}
                    </button>
                    <div className="h-[1px] bg-gray-50 my-1" />
                    <button
                      onClick={() => handleDeleteAction(item)}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 /> Xóa bỏ
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [vouchers]
  );

const kpiItems = useMemo(() => [
  { id: "total", title: "Tổng voucher", value: stats.totalVouchers, colorTheme: "blue" as const, icon: <Ticket /> },
  { id: "shop", title: "Của tôi", value: stats.shopVouchers, colorTheme: "purple" as const, icon: <ShoppingBag /> },
  { id: "platform", title: "Từ Sàn", value: stats.platformVouchers, colorTheme: "orange" as const, icon: <Zap /> },
  { id: "running", title: "Đang chạy", value: stats.applicableVouchers, colorTheme: "green" as const, icon: <ShieldCheck /> },
], [stats]);
  const handleToggleAction = async (id: string) => {
    const res = await handleToggle(id);
    if (res?.code === 1000) {
      success("Cập nhật thành công");
      fetchVouchers(pagination.current);
    }
  };
  const handleDuplicateAction = async (id: string) => {
    const res = await handleDuplicate(id);
    if (res?.code === 1000) {
      success("Đã sao chép");
      fetchVouchers(1);
    }
  };
  const handleDeleteAction = async (voucher: VoucherTemplate) => {
    if (window.confirm(`Xác nhận xóa: ${voucher.name}?`)) {
      const res = await handleDelete(voucher.id);
      if (res?.code === 1000) {
        success("Đã xóa");
        fetchVouchers(pagination.current);
        fetchStatistics();
      }
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-gray-900 rounded-[1.25rem] text-white shadow-xl">
              <Ticket size={28} />
            </div>
            Quản lý Voucher
          </h1>
          <p className="text-sm text-gray-500 font-medium ml-1">
            Tạo và quản trị các chiến dịch ưu đãi của Shop
          </p>
        </div>

        <ButtonField
          type="login"
          onClick={() => setCreateModalOpen(true)}
          className="w-60 h-12 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-custom "
        >
          <span className="flex gap-2 items-center">
            <Plus size={16} className="mr-2" strokeWidth={3} /> Tạo Voucher Mới
          </span>
        </ButtonField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiItems.map((kpi) => (
          <SmartKPICard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            colorTheme={kpi.colorTheme}
            loading={loading}
            icon={kpi.icon}
          />
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-full lg:w-auto focus-within:ring-4 focus-within:ring-orange-500/10 transition-all">
            <Search size={18} className="ml-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm tên hoặc mã voucher..."
              className="bg-transparent border-none outline-none p-2 text-sm font-bold text-gray-700 w-full lg:min-w-[350px]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && fetchVouchers(1, activeTab, searchText)
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <SelectComponent
              className="w-40"
              options={pageSizeOptions}
              value={String(pagination.pageSize)}
              onChange={(val) => {
                const newSize = Number(val);
                setPagination((p) => ({ ...p, pageSize: newSize, current: 1 }));
                fetchVouchers(1, activeTab, searchText, newSize);
              }}
            />

            <button
              onClick={handleResetFilters}
              className="p-3 bg-gray-50 text-gray-400 hover:text-(--color-mainColor) rounded-2xl transition-all shadow-sm"
            >
              <Eraser size={20} />
            </button>
            <button
              onClick={handleRefresh}
              className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-2xl transition-all shadow-sm"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        <div className="h-[68px]">
          <StatusTabsTable
            current={activeTab}
            onChange={setActiveTab}
            stats={stats}
          />
        </div>

        <div className="min-h-[500px] transition-all duration-300">
          <DataTable
            data={vouchers}
            columns={columns}
            loading={loading}
            page={pagination.current - 1}
            size={pagination.pageSize}
            totalElements={pagination.total}
            onPageChange={(newPage) => fetchVouchers(newPage + 1)}
          />
        </div>
      </div>

      <ShopVoucherCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          fetchStatistics();
          fetchVouchers(1, "shop");
          setActiveTab("shop");
        }}
      />
      <ShopVoucherEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedVoucher(null);
        }}
        voucher={selectedVoucher}
        onSuccess={() => {
          setEditModalOpen(false);
          setSelectedVoucher(null);
          fetchVouchers(pagination.current);
          fetchStatistics();
        }}
      />
      {selectedVoucher && (
        <>
          <ShopVoucherPurchaseModal
            open={purchaseModalOpen}
            voucher={selectedVoucher}
            onClose={() => {
              setPurchaseModalOpen(false);
              setSelectedVoucher(null);
            }}
            onSuccess={() => {
              setPurchaseModalOpen(false);
              setSelectedVoucher(null);
              fetchStatistics();
              fetchVouchers(pagination.current, activeTab);
            }}
          />
          <ShopVoucherDetailModal
            open={detailModalOpen}
            templateId={selectedVoucher.id}
            onClose={() => {
              setDetailModalOpen(false);
              setSelectedVoucher(null);
            }}
          />
        </>
      )}
    </div>
  );
}
