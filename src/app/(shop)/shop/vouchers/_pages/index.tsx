"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tabs, Card, Badge, Space, Spin, Typography, Statistic, Row, Col } from "antd";
import {
  TagOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  HistoryOutlined,
  FireOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import ShopVoucherList from "../components/vouchers/ShopVoucherList";
import PlatformVoucherMarket from "../components/vouchers/PlatformVoucherMarket";
import VoucherStatistics from "../components/vouchers/VoucherStatistics"; 
import VoucherHistory from "../components/vouchers/VoucherHistory";
import PurchasedVoucherList from "../components/vouchers/PurchasedVoucherList";
import { searchVoucherTemplates } from "@/app/(main)/shop/_service/shop.voucher.service";

const { Title, Text } = Typography;

/**
 * 📊 Shop Voucher Management Page
 * 
 * Cấu trúc theo API:
 * 1. Voucher của tôi → GET /templates?scope=shop (Shop tự tạo)
 * 2. Voucher Platform → GET /templates?scope=platform (Sàn bán)
 * 3. Voucher đã mua → GET /instances by shopId (Đã mua từ sàn)
 * 4. Thống kê → VoucherUsage analytics
 * 5. Lịch sử → VoucherTransaction history
 */

interface TabCounts {
  myVouchers: number;
  activeVouchers: number;
  platformAvailable: number;
  purchasedVouchers: number;
  transactions: number;
}

export const ShopVouchersScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("my-vouchers");
  const [counts, setCounts] = useState<TabCounts>({
    myVouchers: 0,
    activeVouchers: 0,
    platformAvailable: 0,
    purchasedVouchers: 0,
    transactions: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch counts on mount
  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        // Fetch shop vouchers count
        const shopRes = await searchVoucherTemplates({
          scope: "shop",
          page: 0,
          size: 1,
        });
        const shopTotal = shopRes.data?.totalElements || 0;

        // Fetch active vouchers count
        const activeRes = await searchVoucherTemplates({
          scope: "shop",
          status: "ACTIVE",
          page: 0,
          size: 1,
        });
        const activeTotal = activeRes.data?.totalElements || 0;

        // Fetch platform vouchers count
        const platformRes = await searchVoucherTemplates({
          scope: "platform",
          page: 0,
          size: 1,
        });
        const platformTotal = platformRes.data?.totalElements || 0;

        setCounts({
          myVouchers: shopTotal,
          activeVouchers: activeTotal,
          platformAvailable: platformTotal,
          purchasedVouchers: 0, // Will be fetched by PurchasedVoucherList
          transactions: 0, // Will be set by VoucherHistory
        });
      } catch (err) {
        console.error("Failed to fetch voucher counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Callbacks for child components to update counts
  const handleTransactionCountUpdate = useCallback((count: number) => {
    setCounts((prev) => ({ ...prev, transactions: count }));
  }, []);

  const handlePurchasedCountUpdate = useCallback((count: number) => {
    setCounts((prev) => ({ ...prev, purchasedVouchers: count }));
  }, []);

  const tabItems = [
    {
      key: "my-vouchers",
      label: (
        <Space>
          <TagOutlined />
          <span>Voucher của tôi</span>
          {loading ? (
            <Spin size="small" />
          ) : (
            <Badge
              count={counts.myVouchers}
              showZero
              style={{ backgroundColor: "#1890ff" }}
            />
          )}
        </Space>
      ),
      children: (
        <div>
          {/* Summary Cards */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card size="small">
                <Statistic
                  title="Tổng voucher"
                  value={counts.myVouchers}
                  prefix={<TagOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Statistic
                  title="Đang hoạt động"
                  value={counts.activeVouchers}
                  prefix={<FireOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
          </Row>
          <ShopVoucherList />
        </div>
      ),
    },
    {
      key: "platform-market",
      label: (
        <Space>
          <ShoppingOutlined />
          <span>Voucher Platform</span>
          {loading ? (
            <Spin size="small" />
          ) : (
            <Badge
              count={counts.platformAvailable}
              showZero
              style={{ backgroundColor: "#52c41a" }}
            />
          )}
        </Space>
      ),
      children: (
        <div>
          <Card
            size="small"
            style={{ marginBottom: 16, background: "#f6ffed", borderColor: "#b7eb8f" }}
          >
            <Space>
              <GiftOutlined style={{ fontSize: 24, color: "#52c41a" }} />
              <div>
                <Text strong>Mua voucher từ sàn</Text>
                <br />
                <Text type="secondary">
                  Voucher freeship, giảm giá... do Platform tài trợ
                </Text>
              </div>
            </Space>
          </Card>
          <PlatformVoucherMarket />
        </div>
      ),
    },
    {
      key: "purchased",
      label: (
        <Space>
          <ShoppingCartOutlined />
          <span>Voucher đã mua</span>
          {counts.purchasedVouchers > 0 && (
            <Badge
              count={counts.purchasedVouchers}
              style={{ backgroundColor: "#722ed1" }}
            />
          )}
        </Space>
      ),
      children: (
        <div>
          <Card
            size="small"
            style={{ marginBottom: 16, background: "#f9f0ff", borderColor: "#d3adf7" }}
          >
            <Space>
              <ShoppingCartOutlined style={{ fontSize: 24, color: "#722ed1" }} />
              <div>
                <Text strong>Voucher bạn đã mua từ Platform</Text>
                <br />
                <Text type="secondary">
                  Áp dụng cho khách hàng của shop khi checkout
                </Text>
              </div>
            </Space>
          </Card>
          <PurchasedVoucherList onCountUpdate={handlePurchasedCountUpdate} />
        </div>
      ),
    },
    {
      key: "statistics",
      label: (
        <Space>
          <BarChartOutlined />
          <span>Thống kê</span>
          {counts.activeVouchers > 0 && (
            <Badge
              count={
                <span style={{ fontSize: 12 }}>
                  <FireOutlined style={{ color: "#ff4d4f" }} /> {counts.activeVouchers}
                </span>
              }
              style={{ backgroundColor: "#fff0f0" }}
            />
          )}
        </Space>
      ),
      children: <VoucherStatistics />,
    },
    {
      key: "history",
      label: (
        <Space>
          <HistoryOutlined />
          <span>Lịch sử</span>
          {counts.transactions > 0 && (
            <Badge
              count={counts.transactions}
              overflowCount={999}
              style={{ backgroundColor: "#fa8c16" }}
            />
          )}
        </Space>
      ),
      children: <VoucherHistory onCountUpdate={handleTransactionCountUpdate} />,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Page Header */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>
          <GiftOutlined /> Quản lý Voucher
        </Title>
        <Text type="secondary">
          Tạo, quản lý và theo dõi hiệu quả voucher cho shop của bạn
        </Text>
      </Card>

      {/* Main Content */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: 16 }}
          items={tabItems}
        />
      </Card>
    </div>
  );
};
