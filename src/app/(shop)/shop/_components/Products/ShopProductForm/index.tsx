"use client";

import { ActionBtn, ButtonField, DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
import { userProductService } from "@/services/products/product.service";
import {
  UserProductDTO,
  UserProductSearchQueryDTO,
  UserProductStatisticsDTO,
} from "@/types/product/user-product.dto";
import { cn } from "@/utils/cn";
import {
  resolveMediaUrl,
  resolveVariantImageUrl,
} from "@/utils/products/media.helpers";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  FileText,
  LayoutGrid,
  PlayCircle,
  Plus,
  RefreshCcw,
  Search,
  Send,
  ShoppingBag,
  StopCircle,
  Tags,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SmartKPICard } from "../../Dashboard";
import Image from "next/image";
import { StatusTabs } from "../StatusTabs";
import { useToast } from "@/hooks/useToast";
type StatusType = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export const ShopProductForm = () => {
  const [products, setProducts] = useState<UserProductDTO[]>([]);
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<UserProductStatisticsDTO | null>(
    null
  );
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusType | "ALL">(
    "ALL"
  );
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState<{
    keyword: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: string;
  }>({
    keyword: "",
    minPrice: undefined,
    maxPrice: undefined,
    categoryId: undefined,
  });

  const getProductThumbUrl = (record: UserProductDTO): string => {
    const media = (record as any)?.media?.[0];
    if (media) {
      const url = resolveMediaUrl(media, "_thumb");
      if (url) return url;
    }
    const firstWithImage = (record as any)?.variants?.find(
      (v: any) => v?.imageUrl || (v?.imageBasePath && v?.imageExtension)
    );
    if (firstWithImage) {
      const url = resolveVariantImageUrl(firstWithImage, "_thumb");
      if (url) return url;
    }
    return "";
  };

  const calculateStatisticsFromProducts = useCallback(
    (productList: UserProductDTO[]): UserProductStatisticsDTO => {
      const stats: UserProductStatisticsDTO = {
        totalProducts: productList.length,
        draftProducts: productList.filter((p) => p.approvalStatus === "DRAFT")
          .length,
        pendingProducts: productList.filter(
          (p) => p.approvalStatus === "PENDING"
        ).length,
        approvedProducts: productList.filter(
          (p) => p.approvalStatus === "APPROVED"
        ).length,
        rejectedProducts: productList.filter(
          (p) => p.approvalStatus === "REJECTED"
        ).length,
        activeProducts: productList.filter((p) => p.active).length,
        inactiveProducts: productList.filter((p) => !p.active).length,
      };
      return stats;
    },
    []
  );

  // --- API Logic ---
  const fetchAllProductsForStatistics = useCallback(async () => {
    try {
      const response = await userProductService.getAllProducts(0, 1000);
      const pageData = response?.data;
      const allProducts = pageData?.content || [];
      const calculatedStats = calculateStatisticsFromProducts(allProducts);
      setStatistics((prev) =>
        !prev || Object.values(prev).every((v) => v === 0)
          ? calculatedStats
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  }, [calculateStatisticsFromProducts]);

  const fetchStatistics = async () => {
    try {
      setStatisticsLoading(true);
      try {
        const response = await userProductService.getStatistics();
        let statsData = (response as any)?.data || response;
        const mappedStats: UserProductStatisticsDTO = {
          totalProducts: Number(
            statsData?.userTotalProducts ?? statsData?.totalProducts ?? 0
          ),
          draftProducts: Number(statsData?.draftProducts ?? 0),
          pendingProducts: Number(
            statsData?.userPendingProducts ?? statsData?.pendingProducts ?? 0
          ),
          approvedProducts: Number(
            statsData?.userApprovedProducts ?? statsData?.approvedProducts ?? 0
          ),
          rejectedProducts: Number(
            statsData?.userRejectedProducts ?? statsData?.rejectedProducts ?? 0
          ),
          activeProducts: Number(
            statsData?.userActiveProducts ?? statsData?.activeProducts ?? 0
          ),
          inactiveProducts: Number(statsData?.inactiveProducts ?? 0),
        };
        if (Object.values(mappedStats).every((v) => v === 0) && statsData) {
          await fetchAllProductsForStatistics();
        } else {
          setStatistics(mappedStats);
        }
      } catch (e) {
        await fetchAllProductsForStatistics();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatisticsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response =
        selectedStatus === "ALL"
          ? await userProductService.getAllProducts(
              pagination.current - 1,
              pagination.pageSize
            )
          : await userProductService.getByStatus(
              selectedStatus,
              pagination.current - 1,
              pagination.pageSize
            );
      // Filter out null values from API response
      const validProducts = (response?.data?.content || []).filter(
        (item: UserProductDTO | null): item is UserProductDTO => item !== null
      );
      setProducts(validProducts);
      setPagination((prev) => ({
        ...prev,
        total: response?.data?.totalElements ?? 0,
        pageSize: response?.data?.size ?? prev.pageSize,
        current: (response?.data?.number ?? 0) + 1,
      }));
    } catch (err) {
      error("Lấy danh sách sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params: UserProductSearchQueryDTO = {
        page: 0,
        size: pagination.pageSize,
      };
      if (filters.keyword) params.keyword = filters.keyword;
      if (selectedStatus !== "ALL") params.status = selectedStatus;
      if (filters.minPrice != null) params.minPrice = filters.minPrice;
      if (filters.maxPrice != null) params.maxPrice = filters.maxPrice;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      const response = await userProductService.search(params);
      let pageData =
        (response as any)?.data || (response?.content ? response : response);
      // Filter out null values from API response
      const validProducts = (pageData?.content || []).filter(
        (item: UserProductDTO | null): item is UserProductDTO => item !== null
      );
      setProducts(validProducts);
      setPagination((prev) => ({
        ...prev,
        total: pageData?.totalElements ?? 0,
        current: 1,
        pageSize: pageData?.size ?? prev.pageSize,
      }));
      setIsSearchMode(true);
    } catch (err) {
      error("Tìm kiếm thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    action: () => Promise<any>,
    successMsg: string
  ) => {
    try {
      await action();
      success(successMsg);
      fetchProducts();
      fetchStatistics();
    } catch (e: any) {
      error(e?.response?.data?.message || "Thao tác thất bại");
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);
  useEffect(() => {
    if (!isSearchMode) fetchProducts();
  }, [selectedStatus, pagination.current, pagination.pageSize, isSearchMode]);

  const resetFilters = () => {
    setFilters({
      keyword: "",
      minPrice: undefined,
      maxPrice: undefined,
      categoryId: undefined,
    });
    setPagination({ current: 1, pageSize: 20, total: 0 });
    setIsSearchMode(false);
    fetchProducts();
  };
  const handleTabChange = (status: any) => {
    setSelectedStatus(status);
    setPagination((p) => ({ ...p, current: 1 }));
    setIsSearchMode(false);
  };

  const columns: Column<UserProductDTO>[] = [
    {
      header: "Sản phẩm",
      render: (record) => {
        const thumbUrl = getProductThumbUrl(record);
        return (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 relative shadow-inner">
              {thumbUrl ? (
                <Image
                  src={thumbUrl}
                  alt=""
                  fill
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
                  <ShoppingBag size={20} />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <Link
                href={`/shop/products/${record.id}`}
                className="text-gray-900 font-bold hover:text-orange-500 truncate transition-colors text-sm uppercase tracking-tight"
              >
                {record.name}
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded">
                  SKU: {record.slug || "N/A"}
                </span>
                <span className="flex items-center gap-1 text-[9px] text-orange-400 font-black uppercase">
                  <Tags size={10} /> {record.category?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Giá niêm yết",
      align: "right",
      render: (record) => (
        <div className="flex flex-col items-end">
          <span className="font-black text-gray-900 text-sm tabular-nums">
            {record.basePrice?.toLocaleString("vi-VN")}{" "}
            <span className="text-[10px] ml-0.5">₫</span>
          </span>
        </div>
      ),
    },
    {
      header: "Trạng thái",
      align: "center",
      render: (record) => {
        const configs = {
          DRAFT: {
            bg: "bg-gray-100",
            text: "text-gray-500",
            label: "Bản nháp",
            icon: <FileText size={12} />,
          },
          PENDING: {
            bg: "bg-amber-50",
            text: "text-amber-600",
            label: "Chờ duyệt",
            icon: <Clock size={12} />,
          },
          APPROVED: {
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            label: "Đã duyệt",
            icon: <CheckCircle2 size={12} />,
          },
          REJECTED: {
            bg: "bg-red-50",
            text: "text-red-600",
            label: "Từ chối",
            icon: <XCircle size={12} />,
          },
        };
        const config =
          configs[record.approvalStatus as StatusType] || configs.DRAFT;
        return (
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest",
              config.bg,
              config.text
            )}
          >
            {config.icon} {config.label}
          </div>
        );
      },
    },
    {
      header: "Hoạt động",
      align: "center",
      render: (record) => (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest",
            record.active
              ? "bg-blue-50 text-blue-600"
              : "bg-gray-100 text-gray-400"
          )}
        >
          {record.active ? <PlayCircle size={12} /> : <StopCircle size={12} />}
          {record.active ? "Đang hoạt động" : "Tạm dừng"}
        </div>
      ),
    },
    {
      header: "Thao tác",
      align: "right",
      render: (record) => (
        <div className="flex items-center justify-end gap-2">
          <ActionBtn
            icon={<Eye size={16} />}
            onClick={() =>
              (window.location.href = `/shop/products/${record.id}`)
            }
          />
          {record.approvalStatus === "DRAFT" && (
            <ActionBtn
              icon={<Send size={16} />}
              color="text-orange-500 border-orange-100"
              onClick={() =>
                handleAction(
                  () =>
                    userProductService.submitForApproval(
                      record.id,
                      record.version
                    ),
                  "Gửi duyệt thành công"
                )
              }
            />
          )}
          {record.approvalStatus === "APPROVED" &&
            (record.active ? (
              <ActionBtn
                icon={<StopCircle size={16} />}
                color="text-red-500 border-red-100"
                onClick={() =>
                  handleAction(
                    () =>
                      userProductService.unpublish(record.id, record.version),
                    "Ngừng xuất bản thành công"
                  )
                }
              />
            ) : (
              <ActionBtn
                icon={<PlayCircle size={16} />}
                color="text-emerald-500 border-emerald-100"
                onClick={() =>
                  handleAction(
                    () => userProductService.publish(record.id, record.version),
                    "Xuất bản thành công"
                  )
                }
              />
            ))}
          <ActionBtn
            icon={<Copy size={16} />}
            onClick={() =>
              handleAction(
                () => userProductService.duplicate(record.id),
                "Sao chép thành công"
              )
            }
          />
          <ActionBtn
            icon={<Trash2 size={16} />}
            color="text-red-600 border-red-100 hover:bg-red-50"
            onClick={() => {
              if (confirm("Xóa sản phẩm này?"))
                handleAction(
                  () => userProductService.delete(record.id, record.version),
                  "Xóa thành công"
                );
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-1 min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50 ">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-orange-500">
            <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200 text-white">
              <ShoppingBag size={28} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 italic uppercase tracking-tighter">
              Sản phẩm
            </h1>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-16">
            Product Management System
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchProducts();
              fetchStatistics();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-white hover:border-orange-200 transition-all active:scale-95"
          >
            <RefreshCcw
              size={14}
              className={statisticsLoading ? "animate-spin" : ""}
            />{" "}
            Tải lại
          </button>
          <Link href="/shop/products/add">
            <ButtonField
              type="login"
              className="w-56 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-100"
            >
              <Plus size={16} className="mr-2" strokeWidth={3} /> Thêm mới
            </ButtonField>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SmartKPICard
          title="Tổng số"
          value={statistics?.totalProducts ?? 0}
          icon={<LayoutGrid size={20} />}
          colorTheme="blue"
          loading={statisticsLoading}
        />
        <SmartKPICard
          title="Đã duyệt"
          value={statistics?.approvedProducts ?? 0}
          icon={<CheckCircle2 size={20} />}
          colorTheme="green"
          loading={statisticsLoading}
        />
        <SmartKPICard
          title="Hoạt động"
          value={statistics?.activeProducts ?? 0}
          icon={<PlayCircle size={20} />}
          colorTheme="orange"
          loading={statisticsLoading}
        />
        <SmartKPICard
          title="Đang chờ"
          value={statistics?.pendingProducts ?? 0}
          icon={<Clock size={20} />}
          colorTheme="blue"
          loading={statisticsLoading}
        />
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50/50 p-4 rounded-[2.5rem] border border-gray-100 space-y-4 shadow-custom">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={filters.keyword}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, keyword: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all shadow-sm"
              />
            </div>
            <div className="md:col-span-3 flex gap-2">
              <input
                type="number"
                placeholder="Giá từ"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    minPrice: Number(e.target.value),
                  }))
                }
                className="w-1/2 px-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 transition-all"
              />
              <input
                type="number"
                placeholder="Đến"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    maxPrice: Number(e.target.value),
                  }))
                }
                className="w-1/2 px-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-orange-500 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <button
                onClick={handleSearch}
                className="w-full h-full bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                Tìm kiếm
              </button>
            </div>
            <div className="md:col-span-2">
              <button
                onClick={resetFilters}
                className="w-full h-full bg-white border border-gray-200 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          <StatusTabs
            current={selectedStatus}
            onChange={handleTabChange}
            statistics={statistics}
          />
        </div>

          <DataTable
            data={products}
            columns={columns}
            loading={loading}
            rowKey="id"
            page={pagination.current - 1}
            size={pagination.pageSize}
            totalElements={pagination.total}
            onPageChange={(newPage) =>
              setPagination((p) => ({ ...p, current: newPage + 1 }))
            }
            emptyMessage="Không có sản phẩm nào phù hợp với điều kiện lọc"
          />
      </div>
    </div>
  );
};
