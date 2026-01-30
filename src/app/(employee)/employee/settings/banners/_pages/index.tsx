// /**
//  * BannerTable Component
//  * Hiển thị danh sách banners với CRUD operations
//  */

// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import dayjs from "dayjs";
// import {
//   Table,
//   Button,
//   Space,
//   Tag,
//   Modal,
//   Typography,
//   Input,
//   Card,
//   Row,
//   Col,
//   Spin,
//   Select,
//   Tabs,
//   Image,
//   Switch,
//   Tooltip,
//   Badge,
// } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   ExclamationCircleOutlined,
//   ReloadOutlined,
//   ClearOutlined,
//   EyeOutlined,
//   GlobalOutlined,
//   MobileOutlined,
//   DesktopOutlined,
// } from "@ant-design/icons";
// import { useBanner } from "../_hooks/useBanner";
// import { useCategoryManagement } from "@/app/(shop)/shop/_hooks";
// import type {
//   BannerResponseDTO,
//   BannerDisplayLocation,
// } from "@/app/(main)/(home)/_types/banner.dto";
// import BannerForm from "../_components/BannerForm";
// import { toPublicUrl } from "@/utils/storage/url";
// import { toSizedVariant } from "@/utils/products/media.helpers";

// const { Search } = Input;
// const { Text, Title } = Typography;
// const { Option } = Select;

// export const BannerSettingsScreen = () => {
//   const {
//     loading,
//     banners,
//     totalElements,
//     totalPages,
//     fetchBanners,
//     searchBanners,
//     deleteBanner,
//     toggleActive,
//   } = useBanner();

//   const [searchText, setSearchText] = useState("");
//   const [activeTab, setActiveTab] = useState<string>("ALL");
//   const [locale, setLocale] = useState<string | undefined>(undefined);
//   const [categoryIds, setCategoryIds] = useState<string[]>([]);
//   const [page, setPage] = useState(0);
//   const [pageSize, setPageSize] = useState(20);

//   // Modal states
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [editingBanner, setEditingBanner] = useState<BannerResponseDTO | null>(
//     null,
//   );

//   const {
//     categories,
//     fetchCategories,
//     loading: categoryLoading,
//   } = useCategoryManagement();
//   const categoryMap = useMemo(() => {
//     const map = new Map<string, string>();
//     categories.forEach((category) => {
//       map.set(category.id, category.name);
//     });
//     return map;
//   }, [categories]);

//   // ==================== LIFECYCLE ====================

//   useEffect(() => {
//     loadBanners();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, pageSize, locale, activeTab, categoryIds]);

//   useEffect(() => {
//     fetchCategories(0, 100);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ==================== LOAD DATA ====================

//   const loadBanners = async (force: boolean = false) => {
//     await searchBanners(
//       {
//         keyword: searchText.trim() || undefined,
//         locale,
//         active: activeTab === "ALL" ? undefined : activeTab === "ACTIVE",
//         categoryIds: categoryIds.length ? categoryIds : undefined,
//         page,
//         size: pageSize,
//       },
//       force,
//     );
//   };

//   // ==================== HANDLERS ====================

//   const handleRefresh = () => {
//     loadBanners(true);
//   };

//   const handleResetFilters = () => {
//     setSearchText("");
//     setLocale(undefined);
//     setCategoryIds([]);
//     setActiveTab("ALL");
//     setPage(0);
//     searchBanners(
//       {
//         keyword: undefined,
//         locale: undefined,
//         active: undefined,
//         categoryIds: undefined,
//         page: 0,
//         size: pageSize,
//       },
//       true,
//     );
//   };

//   const handleTabChange = (key: string) => {
//     setActiveTab(key);
//     setPage(0);
//   };

//   const handleAdd = () => {
//     setEditingBanner(null);
//     setIsFormModalOpen(true);
//   };

//   const handleEdit = (record: BannerResponseDTO) => {
//     setEditingBanner(record);
//     setIsFormModalOpen(true);
//   };

//   const handleDelete = (record: BannerResponseDTO) => {
//     Modal.confirm({
//       title: "Xác nhận xóa banner",
//       icon: <ExclamationCircleOutlined />,
//       content: (
//         <div>
//           <p>
//             Bạn có chắc chắn muốn xóa banner{" "}
//             <strong>{record.title || record.id}</strong>?
//           </p>
//         </div>
//       ),
//       okText: "Xóa",
//       okType: "danger",
//       cancelText: "Hủy",
//       onOk: async () => {
//         if (record.version) {
//           const success = await deleteBanner(
//             record.id,
//             record.version.toString(),
//           );
//           if (success) {
//             loadBanners(true);
//           }
//         }
//       },
//     });
//   };

//   const handleToggleActive = async (
//     record: BannerResponseDTO,
//     checked: boolean,
//   ) => {
//     if (record.version) {
//       const success = await toggleActive(
//         record.id,
//         { active: checked },
//         record.version.toString(),
//       );
//       if (success) {
//         loadBanners(true);
//       }
//     }
//   };

//   const handleFormSuccess = () => {
//     setIsFormModalOpen(false);
//     setEditingBanner(null);
//     loadBanners(true);
//   };

//   const handleFormCancel = () => {
//     setIsFormModalOpen(false);
//     setEditingBanner(null);
//   };

//   // ==================== HELPER FUNCTIONS ====================

//   const getDisplayLocationLabel = (
//     location?: BannerDisplayLocation,
//   ): string => {
//     const labels: Record<string, string> = {
//       HOMEPAGE_INTRO: "Trang chủ - Intro (Lần đầu)",
//       HOMEPAGE_HERO: "Trang chủ - Hero",
//       HOMEPAGE_SIDEBAR: "Trang chủ - Sidebar",
//       HOMEPAGE_FOOTER: "Trang chủ - Footer",
//       PRODUCT_PAGE_TOP: "Sản phẩm - Top",
//       PRODUCT_PAGE_BOTTOM: "Sản phẩm - Bottom",
//       PRODUCT_PAGE_SIDEBAR: "Sản phẩm - Sidebar",
//       CATEGORY_PAGE_TOP: "Danh mục - Top",
//       CATEGORY_PAGE_SIDEBAR: "Danh mục - Sidebar",
//       PRODUCT_LIST_TOP: "Danh sách - Top",
//       PRODUCT_LIST_SIDEBAR: "Danh sách - Sidebar",
//       CART_PAGE: "Giỏ hàng",
//       CHECKOUT_PAGE: "Thanh toán",
//       GLOBAL: "Toàn cục",
//     };
//     return labels[location || ""] || location || "-";
//   };

//   // ==================== TABLE COLUMNS ====================

//   const columns: ColumnsType<BannerResponseDTO> = [
//     {
//       title: "Hình ảnh",
//       dataIndex: "basePath",
//       key: "image",
//       width: 120,
//       fixed: "left",
//       responsive: ["md"],
//       render: (_, record) => {
//         if (record.basePath && record.extension) {
//           const extension = record.extension.startsWith(".")
//             ? record.extension
//             : `.${record.extension}`;
//           const rawPath = `${record.basePath}${extension}`;
//           const sizedPath = toSizedVariant(rawPath, "_orig");
//           const imageUrl = toPublicUrl(sizedPath);
//           return (
//             <Image
//               src={imageUrl}
//               alt={record.title || "Banner"}
//               width={100}
//               height={75}
//               style={{
//                 objectFit: "cover",
//                 borderRadius: 6,
//                 border: "1px solid #f0f0f0",
//               }}
//               preview={{
//                 mask: <EyeOutlined />,
//               }}
//               fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='75'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23bfbfbf' font-size='12'%3ENo image%3C/text%3E%3C/svg%3E"
//             />
//           );
//         }
//         return (
//           <div
//             style={{
//               width: 100,
//               height: 75,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               background: "#f5f5f5",
//               borderRadius: 6,
//               border: "1px dashed #d9d9d9",
//             }}
//           >
//             <Text type="secondary" style={{ fontSize: 12 }}>
//               Không có ảnh
//             </Text>
//           </div>
//         );
//       },
//     },
//     {
//       title: "Thông tin",
//       key: "info",
//       fixed: "left",
//       width: 250,
//       render: (_, record) => (
//         <div>
//           <div style={{ marginBottom: 4 }}>
//             <Text strong style={{ fontSize: 14 }}>
//               {record.title || <Text type="secondary">(Không có tiêu đề)</Text>}
//             </Text>
//           </div>
//           {record.subtitle && (
//             <div>
//               <Text type="secondary" ellipsis style={{ fontSize: 12 }}>
//                 {record.subtitle}
//               </Text>
//             </div>
//           )}
//           {record.href && (
//             <div style={{ marginTop: 4 }}>
//               <Text
//                 type="secondary"
//                 ellipsis
//                 style={{ fontSize: 11 }}
//                 copyable={{ text: record.href }}
//               >
//                 {record.href}
//               </Text>
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Vị trí hiển thị",
//       dataIndex: "displayLocation",
//       key: "displayLocation",
//       width: 180,
//       responsive: ["lg"],
//       render: (location) => (
//         <Tag color="purple" style={{ margin: 0 }}>
//           {getDisplayLocationLabel(location)}
//         </Tag>
//       ),
//     },
//     {
//       title: "Vị trí",
//       dataIndex: "position",
//       key: "position",
//       width: 90,
//       responsive: ["lg"],
//       sorter: true,
//       render: (pos) => <Text>{pos ?? 0}</Text>,
//     },
//     {
//       title: "Ưu tiên",
//       dataIndex: "priority",
//       key: "priority",
//       width: 90,
//       responsive: ["lg"],
//       sorter: true,
//       render: (priority) => (
//         <Badge
//           count={priority ?? 0}
//           showZero
//           style={{
//             backgroundColor: priority && priority > 0 ? "#52c41a" : "#d9d9d9",
//           }}
//         />
//       ),
//     },
//     {
//       title: "Thời gian hiển thị",
//       key: "schedule",
//       width: 220,
//       responsive: ["lg"],
//       render: (_, record) => {
//         const formatTime = (value?: string) =>
//           value ? dayjs(value).format("HH:mm DD/MM/YYYY") : "Không giới hạn";

//         const startLabel = formatTime(record.scheduleStart);
//         const endLabel = formatTime(record.scheduleEnd);
//         let remainingTag: React.ReactNode = null;

//         if (record.scheduleEnd) {
//           const diffDays = dayjs(record.scheduleEnd).diff(dayjs(), "day", true);
//           if (diffDays < 0) {
//             remainingTag = <Tag color="red">Đã hết hạn</Tag>;
//           } else if (diffDays < 1) {
//             remainingTag = <Tag color="orange">Còn &lt; 1 ngày</Tag>;
//           } else if (diffDays < 3) {
//             remainingTag = (
//               <Tag color="orange">Còn {Math.ceil(diffDays)} ngày</Tag>
//             );
//           } else {
//             remainingTag = (
//               <Tag color="blue">Còn {Math.ceil(diffDays)} ngày</Tag>
//             );
//           }
//         }

//         return (
//           <Space direction="vertical" size={2}>
//             <Text
//               style={{ fontSize: 12 }}
//               type={record.scheduleStart ? undefined : "secondary"}
//             >
//               <Text strong>Từ:&nbsp;</Text>
//               {startLabel}
//             </Text>
//             <Text
//               style={{ fontSize: 12 }}
//               type={record.scheduleEnd ? undefined : "secondary"}
//             >
//               <Text strong>Đến:&nbsp;</Text>
//               {endLabel}
//             </Text>
//             {remainingTag}
//           </Space>
//         );
//       },
//     },
//     {
//       title: "Locale",
//       dataIndex: "locale",
//       key: "locale",
//       width: 100,
//       responsive: ["md"],
//       render: (locale) => <Tag color="cyan">{locale || "Tất cả"}</Tag>,
//     },
//     {
//       title: "Thiết bị",
//       dataIndex: "deviceTarget",
//       key: "deviceTarget",
//       width: 120,
//       responsive: ["md"],
//       render: (target) => {
//         const config: Record<
//           string,
//           { color: string; icon: React.ReactNode; label: string }
//         > = {
//           ALL: {
//             color: "blue",
//             icon: <GlobalOutlined />,
//             label: "Tất cả",
//           },
//           DESKTOP: {
//             color: "green",
//             icon: <DesktopOutlined />,
//             label: "Desktop",
//           },
//           MOBILE: {
//             color: "orange",
//             icon: <MobileOutlined />,
//             label: "Mobile",
//           },
//         };
//         const cfg = config[target || "ALL"] || config.ALL;
//         return (
//           <Tag color={cfg.color} icon={cfg.icon}>
//             {cfg.label}
//           </Tag>
//         );
//       },
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "active",
//       key: "active",
//       width: 120,
//       render: (active, record) => (
//         <Space direction="vertical" size={0}>
//           <Switch
//             checked={active}
//             onChange={(checked) => handleToggleActive(record, checked)}
//             checkedChildren="Bật"
//             unCheckedChildren="Tắt"
//             size="small"
//           />
//           <Tag color={active ? "green" : "default"} style={{ marginTop: 4 }}>
//             {active ? "Đang chạy" : "Đã tắt"}
//           </Tag>
//         </Space>
//       ),
//     },
//     {
//       title: "Danh mục",
//       dataIndex: "categoryId",
//       key: "categoryId",
//       width: 200,
//       responsive: ["lg"],
//       render: (value) =>
//         value ? (
//           <Tag color="geekblue">
//             {categoryMap.get(value) || "Danh mục"} • {value}
//           </Tag>
//         ) : (
//           <Tag color="default">Global</Tag>
//         ),
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       width: 120,
//       fixed: "right",
//       render: (_, record) => (
//         <Space size="small" direction="vertical">
//           <Button
//             type="primary"
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//             size="small"
//             block
//           >
//             Sửa
//           </Button>
//           <Button
//             danger
//             icon={<DeleteOutlined />}
//             onClick={() => handleDelete(record)}
//             size="small"
//             block
//           >
//             Xóa
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   // ==================== RENDER ====================

//   return (
//     <div className="space-y-4 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <Title level={2} className="!mb-1 !text-2xl md:!text-3xl">
//             Quản lý Banner
//           </Title>
//           <Text type="secondary" className="text-sm md:text-base">
//             Quản lý banners hiển thị trên trang chủ và các trang khác
//           </Text>
//         </div>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={handleAdd}
//           size="large"
//           className="w-full sm:w-auto"
//         >
//           <span className="hidden sm:inline">Thêm Banner</span>
//           <span className="sm:hidden">Thêm mới</span>
//         </Button>
//       </div>

//       <Card className="shadow-sm">
//         <Row gutter={[16, 16]}>
//           <Col xs={24} sm={12} md={10} lg={8}>
//             <Search
//               placeholder="Tìm kiếm theo tiêu đề, mô tả..."
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               onSearch={() => {
//                 setPage(0);
//                 loadBanners();
//               }}
//               allowClear
//               enterButton
//               size="large"
//             />
//           </Col>
//           <Col xs={12} sm={6} md={4} lg={3}>
//             <Select
//               placeholder="Locale"
//               value={locale}
//               onChange={setLocale}
//               allowClear
//               style={{ width: "100%" }}
//               size="large"
//             >
//               <Option value="vi">Tiếng Việt</Option>
//               <Option value="en">English</Option>
//             </Select>
//           </Col>
//           <Col xs={12} sm={6} md={5} lg={4}>
//             <Button
//               icon={<ReloadOutlined />}
//               onClick={handleRefresh}
//               size="large"
//               block
//             >
//               <span className="hidden md:inline">Làm mới</span>
//               <span className="md:hidden">Refresh</span>
//             </Button>
//           </Col>
//           <Col xs={24} sm={12} md={5} lg={4}>
//             <Select
//               placeholder="Danh mục"
//               mode="multiple"
//               value={categoryIds}
//               onChange={setCategoryIds}
//               allowClear
//               showSearch
//               optionFilterProp="label"
//               style={{ width: "100%" }}
//               size="large"
//               loading={categoryLoading}
//               options={categories.map((category) => ({
//                 label: `${category.name} • ${category.id}`,
//                 value: category.id,
//               }))}
//               filterOption={(input, option) =>
//                 (option?.label as string)
//                   ?.toLowerCase()
//                   ?.includes(input.toLowerCase())
//               }
//             />
//           </Col>
//           <Col xs={24} sm={24} md={5} lg={4}>
//             <Button
//               icon={<ClearOutlined />}
//               onClick={handleResetFilters}
//               size="large"
//               block
//             >
//               <span className="hidden md:inline">Xóa bộ lọc</span>
//               <span className="md:hidden">Xóa lọc</span>
//             </Button>
//           </Col>
//         </Row>
//       </Card>

//       {/* Tabs */}
//       <Card className="shadow-sm" bodyStyle={{ padding: "12px 16px" }}>
//         <Tabs
//           activeKey={activeTab}
//           onChange={handleTabChange}
//           items={[
//             {
//               key: "ALL",
//               label: (
//                 <span>
//                   Tất cả{" "}
//                   <Badge
//                     count={totalElements}
//                     style={{ backgroundColor: "#52c41a" }}
//                   />
//                 </span>
//               ),
//             },
//             {
//               key: "ACTIVE",
//               label: "Đang hoạt động",
//             },
//             {
//               key: "INACTIVE",
//               label: "Đã tắt",
//             },
//           ]}
//           size="large"
//         />
//       </Card>

//       {/* Table */}
//       <Card className="shadow-sm">
//         <Spin spinning={loading} tip="Đang tải dữ liệu...">
//           <Table
//             columns={columns}
//             dataSource={banners}
//             rowKey="id"
//             scroll={{ x: 1200 }}
//             pagination={{
//               current: page + 1,
//               pageSize,
//               total: totalElements,
//               showSizeChanger: true,
//               showQuickJumper: true,
//               showTotal: (total, range) =>
//                 `${range[0]}-${range[1]} của ${total} banner`,
//               pageSizeOptions: ["10", "20", "50", "100"],
//               responsive: true,
//               onChange: (newPage, newSize) => {
//                 setPage(newPage - 1);
//                 setPageSize(newSize);
//               },
//             }}
//             size="middle"
//             className="banner-table"
//           />
//         </Spin>
//       </Card>

//       {/* Form Modal */}
//       <BannerForm
//         banner={editingBanner}
//         open={isFormModalOpen}
//         onSuccess={handleFormSuccess}
//         onCancel={handleFormCancel}
//       />
//     </div>
//   );
// };
import React from 'react'

export const BannerSettingsScreen = () => {
  return (
    <div>BannerSettingsScreen</div>
  )
}
