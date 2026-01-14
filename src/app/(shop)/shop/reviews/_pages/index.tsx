"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Table,
  Space,
  Button,
  Tag,
  Tooltip,
  Select,
  Input,
} from "antd";
import {
  StarOutlined,
  MessageOutlined,
  EyeOutlined,
  ReloadOutlined,
  ShopOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useGetReviews, useGetReviewStatistics } from "../_hooks/useShopReview";
import {
  ReviewResponse,
  ReviewPageDto,
  ReviewStatisticsResponse,
} from "../_types/review.types";
import ReviewStatistics from "../_components/ReviewStatistics";
import ReviewResponseModal from "../_components/ReviewResponseModal";
import ProductReviewsSection from "../_components/ProductReviewsSection";
import ProductListForReviews from "../_components/ProductListForReviews";
import { getStoredUserDetail } from "@/utils/jwt";
const { Option } = Select;
const { Search } = Input;

export default function ShopReviewsScreen() {
  const getReviews = useGetReviews();
  const getStatistics = useGetReviewStatistics();

  const [activeTab, setActiveTab] = useState<"products" | "shop">("products");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const user = getStoredUserDetail();
  const shopId = user?.shopId;

  // Local state for data
  const [reviewsData, setReviewsData] = useState<ReviewPageDto | null>(null);
  const [statisticsData, setStatisticsData] =
    useState<ReviewStatisticsResponse | null>(null);

  // Fetch shop reviews statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      if (activeTab === "shop") {
        const res = await getStatistics.handleGetReviewStatistics(
          "SHOP",
          shopId
        );
        if (res && res.data) {
          setStatisticsData(res.data);
        }
      }
    };
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Table columns for reviews list
  const columns: ColumnsType<ReviewResponse> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_: unknown, __: unknown, index: number) => (
        <span className="text-gray-500">
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
      ),
    },
    {
      title: "Người đánh giá",
      key: "user",
      width: 180,
      render: (_: unknown, record: ReviewResponse) => (
        <div className="flex items-center gap-2">
          <span>{record.username || record.buyerName}</span>
          {record.verifiedPurchase && <Tag color="green">Đã mua</Tag>}
        </div>
      ),
    },
    {
      title: "Rating",
      key: "rating",
      width: 120,
      align: "center",
      render: (_: unknown, record: ReviewResponse) => (
        <div className="flex items-center gap-1">
          <StarOutlined className="text-yellow-400" />
          <span className="font-semibold">{record.rating}</span>
        </div>
      ),
    },
    {
      title: "Nội dung",
      key: "comment",
      ellipsis: true,
      render: (_: unknown, record: ReviewResponse) => (
        <Tooltip title={record.comment}>
          <span className="text-gray-700">
            {record.comment || "Không có bình luận"}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Phản hồi",
      key: "response",
      width: 100,
      align: "center",
      render: (_: unknown, record: ReviewResponse) => (
        <Tag color={record.hasResponse ? "green" : "default"}>
          {record.hasResponse ? "Đã trả lời" : "Chưa trả lời"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      key: "createdDate",
      width: 150,
      render: (_: unknown, record: ReviewResponse) =>
        new Date(record.createdDate).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_: unknown, record: ReviewResponse) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                if (record.reviewType === "PRODUCT") {
                  setSelectedProductId(record.reviewableId);
                }
              }}
            />
          </Tooltip>
          {!record.hasResponse && (
            <Tooltip title="Trả lời">
              <Button
                type="text"
                size="small"
                icon={<MessageOutlined />}
                onClick={() => {
                  setSelectedReviewId(record.id);
                  setResponseModalOpen(true);
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
      total: pagination.total,
    });
  };

  const handleResponseSuccess = async () => {
    // Refresh reviews
    if (activeTab === "shop") {
      const reviewsRes = await getReviews.handleGetReviews("SHOP", shopId, {
        page: pagination.current - 1,
        size: pagination.pageSize,
      });
      if (reviewsRes && reviewsRes.data) {
        setReviewsData(reviewsRes.data);
        setPagination((prev) => ({
          ...prev,
          total: reviewsRes.data.totalElements,
        }));
      }
    }
    const statsRes = await getStatistics.handleGetReviewStatistics(
      activeTab === "shop" ? "SHOP" : "PRODUCT",
      selectedProductId || ""
    );
    if (statsRes && statsRes.data) {
      setStatisticsData(statsRes.data);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Simple Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
          Quản lý Reviews
        </h1>
      </div>

      {/* Simple Tabs */}
      <Card style={{ marginBottom: 24 }}>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as "products" | "shop")}
          items={[
            {
              key: "products",
              label: (
                <span>
                  <AppstoreOutlined /> Reviews Sản phẩm
                </span>
              ),
            },
            {
              key: "shop",
              label: (
                <span>
                  <ShopOutlined /> Reviews Shop
                </span>
              ),
            },
          ]}
        />
      </Card>

      {/* Content based on tab */}
      {activeTab === "products" ? (
        <div>
          {selectedProductId ? (
            <div>
              <Button
                onClick={() => setSelectedProductId(null)}
                style={{ marginBottom: 16 }}
              >
                ← Quay lại danh sách sản phẩm
              </Button>
              <ProductReviewsSection productId={selectedProductId} />
            </div>
          ) : (
            <ProductListForReviews onSelectProduct={setSelectedProductId} />
          )}
        </div>
      ) : (
        <div>
          {/* Shop Reviews Statistics */}
          <ReviewStatistics
            statistics={statisticsData}
            loading={getStatistics.loading}
          />

          {/* Filters & Table */}
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Search
                  placeholder="Tìm theo Tên Sản Phẩm, Mã Đơn Hàng, Tên đăng nhập người mua"
                  allowClear
                  style={{ width: 400 }}
                />
                <Select
                  placeholder="Chọn thời gian"
                  allowClear
                  style={{ width: 150 }}
                >
                  <Option value="7days">7 ngày</Option>
                  <Option value="30days">30 ngày</Option>
                  <Option value="90days">90 ngày</Option>
                </Select>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={async () => {
                    const reviewsRes = await getReviews.handleGetReviews(
                      "SHOP",
                      shopId,
                      {
                        page: pagination.current - 1,
                        size: pagination.pageSize,
                      }
                    );
                    if (reviewsRes && reviewsRes.data) {
                      setReviewsData(reviewsRes.data);
                      setPagination((prev) => ({
                        ...prev,
                        total: reviewsRes.data.totalElements,
                      }));
                    }
                    const statsRes =
                      await getStatistics.handleGetReviewStatistics(
                        "SHOP",
                        shopId
                      );
                    if (statsRes && statsRes.data) {
                      setStatisticsData(statsRes.data);
                    }
                  }}
                  loading={getReviews.loading || getStatistics.loading}
                >
                  Đặt lại
                </Button>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={reviewsData?.content || []}
              rowKey="id"
              loading={getReviews.loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showTotal: (total: any) => `Tổng ${total} reviews`,
              }}
              onChange={handleTableChange}
            />
          </Card>
        </div>
      )}

      {/* Response Modal */}
      <ReviewResponseModal
        open={responseModalOpen}
        reviewId={selectedReviewId}
        onClose={() => {
          setResponseModalOpen(false);
          setSelectedReviewId(null);
        }}
        onSuccess={handleResponseSuccess}
      />
    </div>
  );
}
