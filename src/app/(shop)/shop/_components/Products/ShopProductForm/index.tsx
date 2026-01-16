"use client";

import { ButtonField, DataTable } from "@/components";
import { Button } from "@/components/button/button";
import { useToast } from "@/hooks/useToast";
import { userProductService } from "@/services/products/product.service";
import {
  UserProductDTO,
  UserProductStatisticsDTO,
} from "@/types/product/user-product.dto";
import { cn } from "@/utils/cn";
import {
  CheckCircle2,
  Clock,
  LayoutGrid,
  PackageCheck,
  PlayCircle,
  Plus,
  RefreshCcw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SmartKPICard } from "../../Dashboard";
import { FilterState, ProductFilters } from "../ProductFilters";
import { StatusTabItem, StatusTabs } from "../StatusTabs";
import { getProductColumns } from "./columns";

type StatusType =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "INACTIVE";

interface UserProductWithShop extends UserProductDTO {
  shopName?: string;
}
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
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    minPrice: null,
    maxPrice: null,
    categoryId: undefined,
  });
  const shopDisplayName = useMemo(() => {
    if (products.length > 0) {
      return (products[0] as UserProductWithShop).shopName;
    }
    return "Cửa hàng của bạn";
  }, [products]);

  const fetchStatistics = async () => {
    try {
      setStatisticsLoading(true);
      const response: any = await userProductService.getStatistics();
      const countData = response.data?.countByStatus || [];
      const statsMap = countData.reduce((acc: any, item: any) => {
        acc[item.status] = item.count;
        return acc;
      }, {});

      const mappedStats: UserProductStatisticsDTO = {
        totalProducts: Number(statsMap["ALL"] || 0),
        draftProducts: Number(statsMap["DRAFT"] || 0),
        pendingProducts: Number(statsMap["PENDING"] || 0),
        approvedProducts: Number(statsMap["APPROVED"] || 0),
        rejectedProducts: Number(statsMap["REJECTED"] || 0),
        activeProducts: Number(statsMap["ACTIVE"] || 0),
        inactiveProducts: Number(statsMap["INACTIVE"] || 0),
      };

      setStatistics(mappedStats);
    } catch (err: any) {
      setStatistics({
        totalProducts: 0,
        draftProducts: 0,
        pendingProducts: 0,
        approvedProducts: 0,
        rejectedProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
      });
    } finally {
      setStatisticsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await userProductService.getAllProducts(
        pagination.current - 1,
        pagination.pageSize
      );

      const mappedProducts: UserProductWithShop[] = (
        response?.data?.content || []
      )
        .filter((item: any) => item !== null)
        .map((item: any) => ({
          ...item,
          shopName: item.shop?.shopName || "N/A",
        }));

      setProducts(mappedProducts);
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

  const handleSearch = useCallback(
    async (targetPage: number = 0, statusOverride?: string) => {
      try {
        setLoading(true);

        const statusToFilter = statusOverride || selectedStatus;

        const searchBody = {
          keyword: filters.keyword?.trim() || undefined,
          approvalStatus: statusToFilter === "ALL" ? undefined : statusToFilter,
          categoryId: filters.categoryId || undefined,
          minPrice: filters.minPrice ?? undefined,
          maxPrice: filters.maxPrice ?? undefined,
          page: targetPage,
          size: pagination.pageSize,
        };
        const response = await userProductService.search(searchBody);
        const content = response?.content || [];

        setProducts(
          content.map((item: any) => ({
            ...item,
            basePrice: item.basePrice || 0,
            active: !!item.active,
            shopName: item.shop?.shopName || "N/A",
            categoryName: item.category?.name || "N/A",
          }))
        );

        setPagination((prev) => ({
          ...prev,
          total: response?.totalElements ?? 0,
          current: (response?.number ?? 0) + 1,
        }));
        setIsSearchMode(true);
      } catch (err) {
        error("Không thể kết nối đến máy chủ");
      } finally {
        setLoading(false);
      }
    },
    [filters, selectedStatus, pagination.pageSize]
  );

  useEffect(() => {
    const hasFilters =
      filters.keyword.trim() !== "" ||
      !!filters.categoryId ||
      filters.minPrice !== null ||
      filters.maxPrice !== null;

    if (hasFilters) {
      setPagination((prev) =>
        prev.current === 1 ? prev : { ...prev, current: 1 }
      );

      const timer = setTimeout(() => {
        handleSearch(0);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setIsSearchMode(false);
    }
  }, [filters, selectedStatus]);

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

  const resetFilters = async () => {
    const defaultFilters = {
      keyword: "",
      minPrice: null,
      maxPrice: null,
      categoryId: undefined,
    };
    setFilters(defaultFilters);
    setSelectedStatus("ALL");
    setPagination({ current: 1, pageSize: 20, total: 0 });
    setIsSearchMode(false);
    await fetchProducts();
  };

  const handleTabChange = (status: StatusType | "ALL") => {
    setSelectedStatus(status);
    setPagination((p) => ({ ...p, current: 1 }));

    handleSearch(0);
  };
  const filteredProducts = useMemo(() => {
    if (selectedStatus === "ALL") return products;
    if (selectedStatus === "ACTIVE") return products.filter((p) => p.active);
    if (selectedStatus === "INACTIVE") return products.filter((p) => !p.active);
    return products.filter((p) => p.approvalStatus === selectedStatus);
  }, [products, selectedStatus]);
  const kpiCards = useMemo(
    () => [
      {
        title: "Tổng số",
        value: statistics?.totalProducts ?? 0,
        icon: <LayoutGrid size={20} />,
        colorTheme: "blue" as const,
      },
      {
        title: "Đã duyệt",
        value: statistics?.approvedProducts ?? 0,
        icon: <CheckCircle2 size={20} />,
        colorTheme: "green" as const,
      },
      {
        title: "Hoạt động",
        value: statistics?.activeProducts ?? 0,
        icon: <PlayCircle size={20} />,
        colorTheme: "orange" as const,
      },
      {
        title: "Đang chờ",
        value: statistics?.pendingProducts ?? 0,
        icon: <Clock size={20} />,
        colorTheme: "blue" as const,
      },
    ],
    [statistics, statisticsLoading]
  );

  const productStatusTabs: StatusTabItem<StatusType | "ALL">[] = [
    {
      key: "ALL",
      label: "Tất cả",
      icon: LayoutGrid,
      count: products.length,
    },
    {
      key: "DRAFT",
      label: "Nháp",
      icon: Clock,
      count: products.filter((p) => p.approvalStatus === "DRAFT").length,
    },
    {
      key: "PENDING",
      label: "Chờ duyệt",
      icon: Clock,
      count: products.filter((p) => p.approvalStatus === "PENDING").length,
    },
    {
      key: "APPROVED",
      label: "Đã duyệt",
      icon: CheckCircle2,
      count: products.filter((p) => p.approvalStatus === "APPROVED").length,
    },
    {
      key: "REJECTED",
      label: "Từ chối",
      icon: XCircle,
      count: products.filter((p) => p.approvalStatus === "REJECTED").length,
    },
    {
      key: "ACTIVE",
      label: "Đang bán",
      icon: PlayCircle,
      count: products.filter((p) => p.active).length,
    },
    {
      key: "INACTIVE",
      label: "Ngừng bán",
      icon: PackageCheck,
      count: products.filter((p) => !p.active).length,
    },
  ];

  const columns = getProductColumns(handleAction, userProductService);
  useEffect(() => {
    fetchStatistics();
  }, []);
  return (
    <div className="p-1 min-h-screen space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50 ">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-orange-500">
            <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200 text-white">
              <ShoppingBag size={28} strokeWidth={2.5} />
            </div>
            <h1 className="flex gap-2 items-center">
              <span className="text-3xl font-bold text-gray-900">Quản Lý Sản phẩm</span>
              <span className="text-4xl font-bold italic uppercase">
                {shopDisplayName}
              </span>
            </h1>
          </div>
          <p className="text-[12px] font-bold text-gray-700 uppercase ml-16">
            Danh sách sản phẩm của bạn
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="edit"
            className="px-8 py-3.5 rounded-2xl font-semibold uppercase text-[10px] tracking-widest text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
            onClick={() => {
              fetchProducts();
              fetchStatistics();
            }}
          >
            <span className="flex gap-2 items-center">
              <RefreshCcw
                size={14}
                className={statisticsLoading ? "animate-spin" : ""}
              />
              Tải lại
            </span>
          </Button>
          <Link href="/shop/products/add">
            <ButtonField
              type="login"
              className="w-40 h-12 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-custom "
            >
              <span className="flex gap-2 items-center">
                <Plus size={16} className="mr-2" strokeWidth={3} /> Thêm mới
              </span>
            </ButtonField>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <SmartKPICard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            colorTheme={card.colorTheme}
            loading={statisticsLoading}
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 space-y-4 shadow-custom">
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
            onReset={resetFilters}
            isLoading={loading}
          />

          <StatusTabs
            tabs={productStatusTabs}
            current={selectedStatus}
            onChange={setSelectedStatus}
          />
        </div>
        <div
          className={cn(
            "transition-opacity duration-300",
            loading ? "opacity-60 pointer-events-none" : "opacity-100"
          )}
        >
          <DataTable
            data={filteredProducts}
            columns={columns}
            loading={loading && products.length === 0}
            rowKey="id"
            page={pagination.current - 1}
            size={pagination.pageSize}
            totalElements={pagination.total}
            onPageChange={(newPage) => {
              if (isSearchMode) handleSearch(newPage);
              else setPagination((p) => ({ ...p, current: newPage + 1 }));
            }}
            emptyMessage="Không tìm thấy sản phẩm nào"
          />
        </div>
      </div>
    </div>
  );
};
