/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { VoucherTemplate } from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import {
  ButtonField,
  DataTable,
  SelectComponent,
  ActionBtn,
  ActionDropdown,
  FormInput,
} from "@/components";
import { Column } from "@/components/DataTable/type";
import { formatCurrency } from "@/hooks/format";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import {
  Copy,
  Edit3,
  Eraser,
  Eye,
  MoreHorizontal,
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
import { SmartKPICard } from "@/app/(shop)/shop/_components";
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

export const ShopVoucherList = () => {
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
    pageSize = pagination.pageSize,
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
    (): Column<VoucherTemplate>[] => [
      {
        header: "Voucher",
        className: "min-w-[280px]",
        render: (item: VoucherTemplate) => (
          <div className="flex flex-col gap-1.5 py-1">
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold w-fit rounded-lg tracking-widest border border-orange-100 uppercase italic">
              {item.code}
            </span>
            <span className="text-[13px] font-bold text-gray-800 line-clamp-1 italic uppercase tracking-tight">
              {item.name}
            </span>
          </div>
        ),
      },
      {
        header: "Mức ưu đãi",
        align: "center",
        render: (item: VoucherTemplate) => (
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "px-3 py-1 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-sm border italic",
                item.discountMethod === "FIXED_AMOUNT"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50"
                  : "bg-orange-50 text-orange-600 border-orange-100 shadow-orange-100/50",
              )}
            >
              {item.discountMethod === "FIXED_AMOUNT"
                ? formatCurrency(item.discountValue)
                : `${item.discountValue}%`}
            </span>
          </div>
        ),
      },
      {
        header: "Nguồn cấp",
        align: "center",
        render: (item: VoucherTemplate) => (
          <span
            className={cn(
              "px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-tighter italic border",
              item.creatorType === "SHOP"
                ? "bg-purple-50 text-purple-600 border-purple-100"
                : "bg-cyan-50 text-cyan-600 border-cyan-100",
            )}
          >
            {item.creatorType === "SHOP" ? "Shop Mall" : "Platform"}
          </span>
        ),
      },
      {
        header: "Trạng thái",
        align: "center",
        render: (item: VoucherTemplate) => (
          <div className="flex items-center justify-center gap-2 bg-gray-50 py-1.5 px-3 rounded-2xl border border-gray-100/50">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                item.active ? "bg-emerald-500 animate-pulse" : "bg-gray-300",
              )}
            />
            <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">
              {item.active ? "Live" : "Pause"}
            </span>
          </div>
        ),
      },
      {
        header: "Thao tác",
        align: "right",
        render: (item: VoucherTemplate) => {
          const isShopVoucher = item.creatorType === "SHOP";
          const dropdownItems = [
            {
              key: "copy",
              label: "Nhân bản",
              icon: <Copy size={14} />,
              onClick: () => handleDuplicateAction(item.id),
            },
            {
              key: "toggle",
              label: item.active ? "Tạm ngưng" : "Kích hoạt",
              icon: <Power size={14} />,
              onClick: () => handleToggleAction(item.id),
            },
            { key: "divider", label: "", type: "divider" as const },
            {
              key: "delete",
              label: "Xóa vĩnh viễn",
              icon: <Trash2 size={14} />,
              danger: true,
              onClick: () => handleDeleteAction(item),
            },
          ];

          return (
            <div className="flex items-center justify-end gap-2">
              <ActionBtn
                icon={<Eye size={16} />}
                onClick={() => {
                  setSelectedVoucher(item);
                  setDetailModalOpen(true);
                }}
                tooltip="Xem chi tiết"
              />

              {isShopVoucher ? (
                <>
                  <ActionBtn
                    icon={<Edit3 size={16} />}
                    onClick={() => {
                      setSelectedVoucher(item);
                      setEditModalOpen(true);
                    }}
                    tooltip="Chỉnh sửa"
                  />
                  <ActionDropdown
                    trigger={<ActionBtn icon={<MoreHorizontal size={16} />} />}
                    items={dropdownItems}
                  />
                </>
              ) : (
                item.purchasable && (
                  <ActionBtn
                    icon={<ShoppingCart size={16} />}
                    color="bg-gray-900 text-white hover:bg-orange-600"
                    onClick={() => {
                      setSelectedVoucher(item);
                      setPurchaseModalOpen(true);
                    }}
                    tooltip="Mua gói voucher"
                  />
                )
              )}
            </div>
          );
        },
      },
    ],
    [vouchers],
  );

  // LOGIC ACTIONS GIỮ NGUYÊN
  const handleToggleAction = async (id: string) => {
    const res = await handleToggle(id);
    if (res?.code === 1000) {
      success("Cập nhật trạng thái thành công");
      fetchVouchers(pagination.current);
    }
  };

  const handleDuplicateAction = async (id: string) => {
    const res = await handleDuplicate(id);
    if (res?.code === 1000) {
      success("Đã nhân bản voucher thành công");
      fetchVouchers(1);
    }
  };

  const handleDeleteAction = async (voucher: VoucherTemplate) => {
    if (window.confirm(`Xác nhận xóa voucher: ${voucher.name}?`)) {
      const res = await handleDelete(voucher.id);
      if (res?.code === 1000) {
        success("Đã xóa voucher khỏi hệ thống");
        fetchVouchers(pagination.current);
        fetchStatistics();
      }
    }
  };

  const kpiItems = useMemo(
    () => [
      {
        id: "total",
        title: "Tổng Voucher",
        value: stats.totalVouchers,
        colorTheme: "blue" as const,
        icon: <Ticket />,
      },
      {
        id: "shop",
        title: "Của Shop",
        value: stats.shopVouchers,
        colorTheme: "purple" as const,
        icon: <ShoppingBag />,
      },
      {
        id: "platform",
        title: "Từ Sàn",
        value: stats.platformVouchers,
        colorTheme: "orange" as const,
        icon: <Zap />,
      },
      {
        id: "running",
        title: "Đang Chạy",
        value: stats.applicableVouchers,
        colorTheme: "green" as const,
        icon: <ShieldCheck />,
      },
    ],
    [stats],
  );

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-900 rounded-3xl text-white shadow-2xl shadow-gray-200">
              <Ticket size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tighter italic leading-none">
                Voucher Management
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="size-1.5 rounded-full bg-orange-500 animate-pulse" />
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Promotion & Marketing Protocol
                </p>
              </div>
            </div>
          </div>
        </div>

        <ButtonField
          type="login"
          onClick={() => setCreateModalOpen(true)}
          className="w-50 h-12 rounded-2xl text-[11px]! font-bold uppercase  shadow-[0_20px_40px_-15px_rgba(249,115,22,0.4)] bg-orange-500"
        >
          <span className="flex gap-3 items-center">
            <Plus size={18} strokeWidth={3} /> Tạo Chiến Dịch Mới
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-4xl shadow-sm border border-gray-100">
          <div className="relative group w-full max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10"
            />
            <FormInput
              placeholder="Truy vấn mã hoặc tên chiến dịch..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && fetchVouchers(1, activeTab, searchText)
              }
              className="w-full h-12 pl-10 pr-4 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <SelectComponent
              className="w-44"
              options={pageSizeOptions}
              value={String(pagination.pageSize)}
              onChange={(val) => {
                const newSize = Number(val);
                setPagination((p) => ({ ...p, pageSize: newSize, current: 1 }));
                fetchVouchers(1, activeTab, searchText, newSize);
              }}
            />

            <ActionBtn
              icon={<Eraser size={20} />}
              onClick={handleResetFilters}
              tooltip="Xóa bộ lọc"
            />
            <ActionBtn
              icon={<RefreshCw size={20} />}
              onClick={handleRefresh}
              tooltip="Làm mới dữ liệu"
              color="bg-white text-blue-500"
            />
          </div>
        </div>

        <div className="h-10">
          <StatusTabsTable
            current={activeTab}
            onChange={setActiveTab}
            stats={stats}
          />
        </div>

        <div className="transition-all duration-500">
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
};
