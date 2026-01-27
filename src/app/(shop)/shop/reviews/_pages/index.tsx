"use client";

import { DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";
import { getStoredUserDetail } from "@/utils/jwt";
import {
  Calendar,
  ChevronLeft,
  Eye,
  MessageSquare,
  Package,
  RefreshCw,
  Search,
  Star,
  Store,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  ProductListForReviews,
  ProductReviewsSection,
  ReviewStatistics,
  ReviewResponseModal,
} from "../_components";
import { useGetReviews, useGetReviewStatistics } from "../_hooks/useShopReview";
import {
  ReviewPageDto,
  ReviewResponse,
  ReviewStatisticsResponse,
  ReviewType,
} from "../_types/review.types";

export default function ShopReviewsScreen() {
  const getReviews = useGetReviews();
  const getStatistics = useGetReviewStatistics();

  const [activeTab, setActiveTab] = useState<"products" | "shop">("products");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
    total: 0,
  });

  const user = getStoredUserDetail();
  const shopId = user?.shopId;

  const [reviewsData, setReviewsData] = useState<ReviewPageDto | null>(null);
  const [statisticsData, setStatisticsData] =
    useState<ReviewStatisticsResponse | null>(null);

  const fetchShopData = useCallback(async () => {
    if (activeTab === "shop" && shopId) {
      const statsRes = await getStatistics.handleGetReviewStatistics(
        "SHOP" as ReviewType,
        shopId,
      );
      if (statsRes && statsRes.data) setStatisticsData(statsRes.data);

      // Fetch Reviews List
      const reviewsRes = await getReviews.handleGetReviews(
        "SHOP" as ReviewType,
        shopId,
        {
          page: pagination.current,
          size: pagination.pageSize,
        },
      );
      if (reviewsRes && reviewsRes.data) {
        setReviewsData(reviewsRes.data);
        setPagination((prev) => ({
          ...prev,
          total: reviewsRes.data.totalElements,
        }));
      }
    }
  }, [activeTab, shopId, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  const columns: Column<ReviewResponse>[] = [
    {
      header: "Người đánh giá",
      className: "w-64",
      render: (record) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold  text-gray-700">
              {record.username || record.buyerName}
            </span>
            {record.verifiedPurchase && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase border border-emerald-100">
                Đã mua
              </span>
            )}
          </div>
          <span className="text-[10px]  text-gray-400 font-medium italic">
            ID: {record.id.slice(0, 8)}...
          </span>
        </div>
      ),
    },
    {
      header: "Đánh giá",
      align: "center",
      className: "w-32",
      render: (record) => (
        <div className="flex items-center justify-center gap-1.5 bg-slate-50 py-1.5 px-3 rounded-xl border border-slate-100">
          <Star size={14} className="text-orange-400 fill-orange-400" />
          <span className="font-bold  text-gray-700">{record.rating}</span>
        </div>
      ),
    },
    {
      header: "Nội dung phản hồi",
      render: (record) => (
        <div className="max-w-md">
          <p className="text-sm  text-gray-600 leading-relaxed line-clamp-2 italic">
            "{record.comment || "Không có nội dung bình luận"}"
          </p>
        </div>
      ),
    },
    {
      header: "Trạng thái",
      align: "center",
      className: "w-40",
      render: (record) => (
        <span
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            record.hasResponse
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-slate-100  text-gray-400 border-slate-200",
          )}
        >
          {record.hasResponse ? "Đã phản hồi" : "Chưa trả lời"}
        </span>
      ),
    },
    {
      header: "Thời gian",
      className: "w-40",
      render: (record) => (
        <div className="flex items-center gap-2  text-gray-400">
          <Calendar size={14} />
          <span className="text-xs font-bold">
            {new Date(record.createdDate).toLocaleDateString("vi-VN")}
          </span>
        </div>
      ),
    },
    {
      header: "Hành động",
      align: "right",
      className: "w-32",
      render: (record) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() =>
              record.reviewType === "PRODUCT" &&
              setSelectedProductId(record.reviewableId)
            }
            className="p-2  text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </button>
          {!record.hasResponse && (
            <button
              onClick={() => {
                setSelectedReviewId(record.id);
                setResponseModalOpen(true);
              }}
              className="p-2  text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
              title="Gửi phản hồi"
            >
              <MessageSquare size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-orange-500 rounded-3xl text-white shadow-lg shadow-orange-200">
            <MessageSquare size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold  text-gray-800 leading-none">
              Trung tâm Đánh giá
            </h1>
            <p className="text-sm  text-gray-400 font-medium mt-2 italic">
              Quản lý và tương tác với ý kiến từ khách hàng
            </p>
          </div>
        </div>

        {/* Tab Switcher (Custom UI) */}
        <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("products")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === "products"
                ? "bg-white text-orange-600 shadow-sm"
                : " text-gray-400 hover:text-gray-600",
            )}
          >
            <Package size={14} /> Sản phẩm
          </button>
          <button
            onClick={() => setActiveTab("shop")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === "shop"
                ? "bg-white text-orange-600 shadow-sm"
                : " text-gray-400 hover:text-gray-600",
            )}
          >
            <Store size={14} /> Cửa hàng
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === "products" ? (
          <div className="animate-in slide-in-from-bottom-2 duration-500">
            {selectedProductId ? (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedProductId(null)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white  text-gray-600 rounded-2xl border border-slate-100 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  <ChevronLeft size={16} /> Quay lại danh sách
                </button>
                <ProductReviewsSection productId={selectedProductId} />
              </div>
            ) : (
              <ProductListForReviews onSelectProduct={setSelectedProductId} />
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <ReviewStatistics
              statistics={statisticsData}
              loading={getStatistics.loading}
            />

            <DataTable
              data={reviewsData?.content || []}
              columns={columns}
              loading={getReviews.loading}
              totalElements={pagination.total}
              page={pagination.current}
              size={pagination.pageSize}
              onPageChange={(p) =>
                setPagination((prev) => ({ ...prev, current: p }))
              }
              rowKey="id"
              headerContent={
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="relative group flex-1 max-w-md">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-400 group-focus-within:text-orange-500 transition-colors"
                      size={18}
                    />
                    <input
                      placeholder="Tìm theo tên người mua, nội dung..."
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={fetchShopData}
                    className="p-3 bg-white border border-slate-200  text-gray-500 rounded-2xl hover:bg-slate-50 transition-all active:scale-90"
                  >
                    <RefreshCw
                      size={20}
                      className={cn(getReviews.loading && "animate-spin")}
                    />
                  </button>
                </div>
              }
            />
          </div>
        )}
      </div>

      <ReviewResponseModal
        open={responseModalOpen}
        reviewId={selectedReviewId}
        onClose={() => {
          setResponseModalOpen(false);
          setSelectedReviewId(null);
        }}
        onSuccess={fetchShopData}
      />
    </div>
  );
}
