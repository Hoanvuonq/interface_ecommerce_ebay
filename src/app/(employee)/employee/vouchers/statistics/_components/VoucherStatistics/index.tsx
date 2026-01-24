// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Row,
//   Col,
//   Card,
//   Tabs,
//   Select,
//   Spin,
//   Alert,
//   Empty,
//   Typography,
//   Tag,
//   Badge,
// } from "antd";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   AreaChart,
//   Area,
// } from "recharts";
// import {
//   GiftOutlined,
//   LoginOutlined,
//   CalendarOutlined,
//   RiseOutlined,
//   EyeOutlined,
//   ClockCircleOutlined,
//   CheckCircleOutlined,
//   DollarOutlined,
//   PercentageOutlined,
// } from "@ant-design/icons";
// import {
//   useVoucherStatistics,
//   useVoucherTimeStats,
//   useVoucherBehaviorStats,
// } from "../../../_hooks/useVoucher";

// const { TabPane } = Tabs;
// const { Option } = Select;
// const { Title, Text } = Typography;

// const COLORS = [
//   "#3b82f6",
//   "#10b981",
//   "#f59e0b",
//   "#ef4444",
//   "#8b5cf6",
//   "#06b6d4",
// ];

// export default function VoucherStatistics() {
//   const { handleGetVoucherStatistics, loading: loadingOverview } =
//     useVoucherStatistics();
//   const { handleGetVoucherTimeStats, loading: loadingTime } =
//     useVoucherTimeStats();
//   const { handleGetVoucherBehaviorStats, loading: loadingBehavior } =
//     useVoucherBehaviorStats();

//   const [overview, setOverview] = useState<any>(null);
//   const [timeStats, setTimeStats] = useState<any>(null);
//   const [behaviorStats, setBehaviorStats] = useState<any>(null);

//   const today = new Date();
//   const [year, setYear] = useState<number>(today.getFullYear());
//   const [month, setMonth] = useState<number>(today.getMonth() + 1);
//   const [yearBehavior, setYearBehavior] = useState<number>(today.getFullYear());
//   const [monthBehavior, setMonthBehavior] = useState<number>(
//     today.getMonth() + 1,
//   );

//   const [availableVouchers, setAvailableVouchers] = useState<
//     Array<{ year: number; month: number }>
//   >([]);
//   const [availableUsage, setAvailableUsage] = useState<
//     Array<{ year: number; month: number }>
//   >([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const resOverview = await handleGetVoucherStatistics();
//         console.log("resOverview", resOverview);
//         if (resOverview?.data) setOverview(resOverview.data);
//         else setError("Không thể tải dữ liệu tổng quan");
//       } catch (e: any) {
//         setError(e?.message || "Lỗi khi tải overview");
//       }

//       try {
//         // Mock available months
//         const mockAvailable = [
//           { year: 2024, month: 1 },
//           { year: 2024, month: 2 },
//           { year: 2024, month: 3 },
//         ];
//         setAvailableVouchers(mockAvailable);
//         setAvailableUsage(mockAvailable);
//         setYear(mockAvailable[0].year);
//         setMonth(mockAvailable[0].month);
//         setYearBehavior(mockAvailable[0].year);
//         setMonthBehavior(mockAvailable[0].month);
//       } catch {
//         // ignore
//       }
//     })();
//   }, []);

//   // === Load time stats khi year/month thay đổi ===
//   useEffect(() => {
//     setError(null);
//     if (!year || !month) return;

//     (async () => {
//       try {
//         const res = await handleGetVoucherTimeStats(year, month);
//         console.log("res", res);
//         setTimeStats(res?.data ?? null);
//       } catch (e: any) {
//         setError(e?.message ?? "Lỗi khi tải thống kê theo thời gian");
//       }
//     })();
//   }, [year, month]);

//   // === Load behavior stats khi yearBehavior/monthBehavior thay đổi ===
//   useEffect(() => {
//     setError(null);
//     if (!yearBehavior || !monthBehavior) return;

//     (async () => {
//       try {
//         const resBehavior = await handleGetVoucherBehaviorStats(
//           yearBehavior,
//           monthBehavior,
//         );
//         console.log("resBehavior", resBehavior);
//         setBehaviorStats(resBehavior?.data ?? null);
//       } catch (e: any) {
//         setError(e?.message ?? "Lỗi khi tải thống kê hành vi");
//       }
//     })();
//   }, [yearBehavior, monthBehavior]);

//   // === Helpers for charts ===
//   const monthlyLineData = useMemo(() => {
//     if (!timeStats?.monthlyGrowth) return [];
//     const arr = Array.from({ length: 12 }, (_, i) => ({
//       month: i + 1,
//       count: 0,
//     }));
//     timeStats.monthlyGrowth.forEach((m: any) => {
//       const idx = Number(m.month) - 1;
//       if (idx >= 0 && idx < 12) arr[idx].count = Number(m.count || 0);
//     });
//     return arr.map((r) => ({ name: `Tháng ${r.month}`, value: r.count }));
//   }, [timeStats]);

//   const dailyBarData = useMemo(() => {
//     if (!timeStats?.dailyGrowth) return [];
//     return timeStats.dailyGrowth.map((d: any) => ({
//       name: d.date,
//       value: d.count,
//     }));
//   }, [timeStats]);

//   const statusPieData = useMemo(() => {
//     if (!overview?.usageByStatus) return [];
//     return Object.entries(overview.usageByStatus).map(([k, v], i) => ({
//       name: k,
//       value: v as number,
//       color: COLORS[i % COLORS.length],
//     }));
//   }, [overview]);

//   const buildOptions = (list: any[]) => {
//     if (!list?.length)
//       return [
//         {
//           label: `${today.getFullYear()}-${String(
//             today.getMonth() + 1,
//           ).padStart(2, "0")}`,
//           year: today.getFullYear(),
//           month: today.getMonth() + 1,
//         },
//       ];
//     return list.map((it: any) => ({
//       label: `${it.year}-${String(it.month).padStart(2, "0")}`,
//       year: it.year,
//       month: it.month,
//     }));
//   };

//   const voucherMonths = buildOptions(availableVouchers);
//   const usageMonths = buildOptions(availableUsage);

//   const renderOverviewCards = () => {
//     if (!overview) return <Empty description="Không có dữ liệu" />;

//     return (
//       <div className="space-y-6">
//         <div className="mb-8">
//           <Title level={2} className="mb-2">
//             Thống kê voucher
//           </Title>
//           <Text type="secondary">
//             Tổng quan về hoạt động và hiệu quả của hệ thống voucher
//           </Text>
//         </div>

//         <Row gutter={[24, 24]} className="mb-8">
//           <Col xs={24} sm={12} lg={6}>
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
//                     <GiftOutlined className="text-xl" />
//                   </div>
//                   <div>
//                     <div className="text-gray-600 text-sm font-medium">
//                       Tổng voucher
//                     </div>
//                     <div className="text-3xl font-bold text-gray-800 mt-1">
//                       {overview.totalVouchers?.toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-green-600 text-sm font-medium">+15%</div>
//                   <div className="text-xs text-gray-500">vs tháng trước</div>
//                 </div>
//               </div>
//             </Card>
//           </Col>

//           <Col xs={24} sm={12} lg={6}>
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-lg">
//                     <CheckCircleOutlined className="text-xl" />
//                   </div>
//                   <div>
//                     <div className="text-gray-600 text-sm font-medium">
//                       Voucher hoạt động
//                     </div>
//                     <div className="text-3xl font-bold text-gray-800 mt-1">
//                       {overview.activeVouchers?.toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-green-600 text-sm font-medium">+8%</div>
//                   <div className="text-xs text-gray-500">tăng trưởng</div>
//                 </div>
//               </div>
//             </Card>
//           </Col>

//           <Col xs={24} sm={12} lg={6}>
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-2xl shadow-lg">
//                     <DollarOutlined className="text-xl" />
//                   </div>
//                   <div>
//                     <div className="text-gray-600 text-sm font-medium">
//                       Tổng giảm giá
//                     </div>
//                     <div className="text-3xl font-bold text-gray-800 mt-1">
//                       {overview.totalDiscount?.toLocaleString()}₫
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-green-600 text-sm font-medium">+25%</div>
//                   <div className="text-xs text-gray-500">tăng trưởng</div>
//                 </div>
//               </div>
//             </Card>
//           </Col>

//           <Col xs={24} sm={12} lg={6}>
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg">
//                     <PercentageOutlined className="text-xl" />
//                   </div>
//                   <div>
//                     <div className="text-gray-600 text-sm font-medium">
//                       Tỷ lệ sử dụng TB
//                     </div>
//                     <div className="text-3xl font-bold text-gray-800 mt-1">
//                       {overview.averageUsage?.toFixed(1)}%
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-green-600 text-sm font-medium">+12%</div>
//                   <div className="text-xs text-gray-500">tăng trưởng</div>
//                 </div>
//               </div>
//             </Card>
//           </Col>
//         </Row>

//         {/* Charts Section */}
//         <Row gutter={[24, 24]}>
//           <Col xs={24} lg={16}>
//             <Card className="shadow-lg border-0">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <Title level={4} className="mb-1">
//                     Phân bố trạng thái voucher
//                   </Title>
//                   <Text type="secondary">
//                     Biểu đồ tròn thể hiện tỷ lệ các trạng thái
//                   </Text>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <RiseOutlined className="text-green-500" />
//                   <span className="text-green-600 font-medium">
//                     Cập nhật thời gian thực
//                   </span>
//                 </div>
//               </div>
//               {statusPieData.length ? (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={statusPieData}
//                       dataKey="value"
//                       nameKey="name"
//                       outerRadius={100}
//                       innerRadius={40}
//                       label={({ name, percent }: any) =>
//                         `${name} ${(percent * 100).toFixed(0)}%`
//                       }
//                     >
//                       {statusPieData.map((entry, idx) => (
//                         <Cell key={idx} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "#fff",
//                         border: "1px solid #e0e0e0",
//                         borderRadius: "8px",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                       }}
//                     />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <Empty description="Không có dữ liệu trạng thái" />
//               )}
//             </Card>
//           </Col>

//           <Col xs={24} lg={8}>
//             <Card className="shadow-lg border-0">
//               <Title level={4} className="mb-4">
//                 Tóm tắt nhanh
//               </Title>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <CheckCircleOutlined className="text-green-500" />
//                     <span className="text-sm font-medium">
//                       Voucher hoạt động
//                     </span>
//                   </div>
//                   <Badge count={overview.activeVouchers} color="green" />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <ClockCircleOutlined className="text-orange-500" />
//                     <span className="text-sm font-medium">Voucher hết hạn</span>
//                   </div>
//                   <Badge count={overview.expiredVouchers} color="orange" />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <EyeOutlined className="text-blue-500" />
//                     <span className="text-sm font-medium">
//                       Tổng lượt sử dụng
//                     </span>
//                   </div>
//                   <Badge count={overview.totalUsage} color="blue" />
//                 </div>
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 min-h-screen">
//       <Tabs
//         defaultActiveKey="overview"
//         type="card"
//         className="custom-tabs"
//         tabBarStyle={{
//           background: "#fff",
//           borderRadius: "12px 12px 0 0",
//           padding: "0 24px",
//           marginBottom: 0,
//         }}
//       >
//         {/* Tab 1: Tổng quan */}
//         <TabPane
//           tab={
//             <span className="flex items-center gap-2">
//               <GiftOutlined />
//               Tổng quan
//             </span>
//           }
//           key="overview"
//         >
//           {loadingOverview ? (
//             <div className="flex justify-center items-center h-64">
//               <Spin size="large" />
//             </div>
//           ) : error ? (
//             <Alert type="error" message={error} showIcon />
//           ) : (
//             renderOverviewCards()
//           )}
//         </TabPane>

//         {/* Tab 2: Theo thời gian */}
//         <TabPane
//           tab={
//             <span className="flex items-center gap-2">
//               <CalendarOutlined />
//               Theo thời gian
//             </span>
//           }
//           key="time"
//         >
//           <div className="space-y-6">
//             {/* Header */}
//             <div className="mb-8">
//               <Title level={2} className="mb-2">
//                 Thống kê theo thời gian
//               </Title>
//               <Text type="secondary">
//                 Phân tích xu hướng tạo voucher theo thời gian
//               </Text>
//             </div>

//             {/* Controls and Quick Stats */}
//             <Card className="shadow-lg border-0 mb-6">
//               <Row gutter={[24, 24]} align="middle">
//                 <Col xs={24} sm={12} md={6}>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       Chọn tháng
//                     </label>
//                     <Select
//                       value={`${year}-${month}`}
//                       style={{ width: "100%" }}
//                       size="large"
//                       onChange={(val) => {
//                         const [y, m] = String(val).split("-").map(Number);
//                         setYear(y);
//                         setMonth(m);
//                       }}
//                     >
//                       {voucherMonths.map((o: any) => (
//                         <Option
//                           key={`${o.year}-${o.month}`}
//                           value={`${o.year}-${o.month}`}
//                         >
//                           {o.label}
//                         </Option>
//                       ))}
//                     </Select>
//                   </div>
//                 </Col>

//                 <Col xs={24} sm={24} md={18}>
//                   <Row gutter={[16, 16]}>
//                     <Col xs={12} sm={6}>
//                       <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
//                         <div className="text-2xl font-bold text-blue-600">
//                           {timeStats?.todayNewVouchers ?? 0}
//                         </div>
//                         <div className="text-sm text-gray-600">Hôm nay</div>
//                       </div>
//                     </Col>
//                     <Col xs={12} sm={6}>
//                       <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
//                         <div className="text-2xl font-bold text-green-600">
//                           {timeStats?.yesterdayNewVouchers ?? 0}
//                         </div>
//                         <div className="text-sm text-gray-600">Hôm qua</div>
//                       </div>
//                     </Col>
//                     <Col xs={12} sm={6}>
//                       <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
//                         <div className="text-2xl font-bold text-orange-600">
//                           {timeStats?.thisMonth ?? 0}
//                         </div>
//                         <div className="text-sm text-gray-600">Tháng này</div>
//                       </div>
//                     </Col>
//                     <Col xs={12} sm={6}>
//                       <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
//                         <div className="text-2xl font-bold text-purple-600">
//                           {timeStats?.lastMonth ?? 0}
//                         </div>
//                         <div className="text-sm text-gray-600">Tháng trước</div>
//                       </div>
//                     </Col>
//                   </Row>
//                 </Col>
//               </Row>
//             </Card>

//             {/* Charts */}
//             <Row gutter={[24, 24]}>
//               <Col xs={24} lg={16}>
//                 <Card className="shadow-lg border-0">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <Title level={4} className="mb-1">
//                         Tạo voucher theo ngày
//                       </Title>
//                       <Text type="secondary">
//                         {year}/{String(month).padStart(2, "0")}
//                       </Text>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <RiseOutlined className="text-green-500" />
//                       <span className="text-green-600 font-medium">
//                         Xu hướng tăng
//                       </span>
//                     </div>
//                   </div>
//                   {loadingTime ? (
//                     <div className="flex justify-center items-center h-64">
//                       <Spin size="large" />
//                     </div>
//                   ) : (
//                     <ResponsiveContainer width="100%" height={350}>
//                       <AreaChart data={dailyBarData}>
//                         <defs>
//                           <linearGradient
//                             id="colorValue"
//                             x1="0"
//                             y1="0"
//                             x2="0"
//                             y2="1"
//                           >
//                             <stop
//                               offset="5%"
//                               stopColor="#3b82f6"
//                               stopOpacity={0.8}
//                             />
//                             <stop
//                               offset="95%"
//                               stopColor="#3b82f6"
//                               stopOpacity={0.1}
//                             />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                         <XAxis dataKey="name" stroke="#666" />
//                         <YAxis stroke="#666" />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: "#fff",
//                             border: "1px solid #e0e0e0",
//                             borderRadius: "8px",
//                             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                           }}
//                         />
//                         <Area
//                           type="monotone"
//                           dataKey="value"
//                           stroke="#3b82f6"
//                           strokeWidth={3}
//                           fillOpacity={1}
//                           fill="url(#colorValue)"
//                         />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   )}
//                 </Card>
//               </Col>

//               <Col xs={24} lg={8}>
//                 <div className="space-y-6">
//                   <Card className="shadow-lg border-0">
//                     <Title level={4} className="mb-4">
//                       Top 5 ngày nhiều voucher
//                     </Title>
//                     {timeStats?.top5Days?.length ? (
//                       <div className="space-y-3">
//                         {timeStats.top5Days.map((d: any, idx: number) => (
//                           <div
//                             key={idx}
//                             className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                           >
//                             <div className="flex items-center gap-3">
//                               <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
//                                 {idx + 1}
//                               </div>
//                               <span className="font-medium">{d.date}</span>
//                             </div>
//                             <Tag color="blue">{d.count} voucher</Tag>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <Empty description="Không có dữ liệu" />
//                     )}
//                   </Card>

//                   <Card className="shadow-lg border-0">
//                     <Title level={4} className="mb-4">
//                       Phân bố theo tháng
//                     </Title>
//                     <ResponsiveContainer width="100%" height={250}>
//                       <PieChart>
//                         <Pie
//                           data={monthlyLineData.slice(0, 6)}
//                           dataKey="value"
//                           nameKey="name"
//                           outerRadius={80}
//                           innerRadius={30}
//                           label={({ name, percent }: any) =>
//                             `${name} ${(percent * 100).toFixed(0)}%`
//                           }
//                         >
//                           {monthlyLineData.map((entry: any, idx: number) => (
//                             <Cell
//                               key={idx}
//                               fill={COLORS[idx % COLORS.length]}
//                             />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </Card>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </TabPane>

//         {/* Tab 3: Hành vi */}
//         <TabPane
//           tab={
//             <span className="flex items-center gap-2">
//               <LoginOutlined />
//               Sử dụng voucher
//             </span>
//           }
//           key="behavior"
//         >
//           <div className="space-y-6">
//             {/* Header */}
//             <div className="mb-8">
//               <Title level={2} className="mb-2">
//                 Thống kê sử dụng voucher
//               </Title>
//               <Text type="secondary">
//                 Phân tích hoạt động sử dụng voucher của người dùng
//               </Text>
//             </div>

//             {/* Controls and Stats */}
//             <Card className="shadow-lg border-0 mb-6">
//               <Row gutter={[24, 24]}>
//                 <Col xs={24} md={6}>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">
//                       Chọn tháng/năm
//                     </label>
//                     <Select
//                       value={`${yearBehavior}-${monthBehavior}`}
//                       style={{ width: "100%" }}
//                       size="large"
//                       onChange={(val) => {
//                         const [y, m] = String(val).split("-").map(Number);
//                         setYearBehavior(y);
//                         setMonthBehavior(m);
//                       }}
//                     >
//                       {usageMonths.map((o: any) => (
//                         <Option
//                           key={`${o.year}-${o.month}`}
//                           value={`${o.year}-${o.month}`}
//                         >
//                           {o.label}
//                         </Option>
//                       ))}
//                     </Select>
//                   </div>
//                 </Col>

//                 <Col xs={24} md={18}>
//                   <Row gutter={[16, 16]}>
//                     <Col xs={12} sm={6}>
//                       <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
//                         <div className="text-2xl font-bold text-blue-600">
//                           {behaviorStats?.loggedInToday ?? 0}
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           Sử dụng hôm nay
//                         </div>
//                       </div>
//                     </Col>
//                     <Col xs={12} sm={6}>
//                       <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
//                         <div className="text-2xl font-bold text-green-600">
//                           {behaviorStats?.thisWeekLoggedIn ?? 0}
//                         </div>
//                         <div className="text-sm text-gray-600">Tuần này</div>
//                       </div>
//                     </Col>
//                     <Col xs={12} sm={6}>
//                       <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
//                         <div className="text-2xl font-bold text-orange-600">
//                           {behaviorStats?.loggedInThisMonth ?? 0}
//                         </div>
//                         <div className="text-sm text-gray-600">Tháng này</div>
//                       </div>
//                     </Col>
//                     <Col xs={12} sm={6}>
//                       <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
//                         <div className="text-2xl font-bold text-purple-600">
//                           {behaviorStats?.loggedInThisYear ?? 0}
//                         </div>
//                         <div className="text-sm text-gray-600">Năm này</div>
//                       </div>
//                     </Col>
//                   </Row>
//                 </Col>
//               </Row>
//             </Card>

//             {/* Charts */}
//             <Row gutter={[24, 24]}>
//               <Col xs={24}>
//                 <Card className="shadow-lg border-0">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <Title level={4} className="mb-1">
//                         Tăng trưởng sử dụng theo tháng
//                       </Title>
//                       <Text type="secondary">
//                         Biểu đồ đường thể hiện xu hướng sử dụng
//                       </Text>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <RiseOutlined className="text-green-500" />
//                       <span className="text-green-600 font-medium">
//                         Tăng trưởng ổn định
//                       </span>
//                     </div>
//                   </div>
//                   {loadingBehavior ? (
//                     <div className="flex justify-center items-center h-64">
//                       <Spin size="large" />
//                     </div>
//                   ) : behaviorStats?.monthlyStats?.length ? (
//                     <ResponsiveContainer width="100%" height={350}>
//                       <LineChart data={behaviorStats.monthlyStats}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                         <XAxis dataKey="month" stroke="#666" />
//                         <YAxis stroke="#666" />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: "#fff",
//                             border: "1px solid #e0e0e0",
//                             borderRadius: "8px",
//                             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                           }}
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="count"
//                           stroke="#10b981"
//                           strokeWidth={3}
//                           dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
//                           activeDot={{
//                             r: 8,
//                             stroke: "#10b981",
//                             strokeWidth: 2,
//                           }}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <Empty description="Không có dữ liệu" />
//                   )}
//                 </Card>
//               </Col>

//               <Col xs={24}>
//                 <Card className="shadow-lg border-0">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <Title level={4} className="mb-1">
//                         Phân bố sử dụng trong tuần
//                       </Title>
//                       <Text type="secondary">
//                         Thống kê hoạt động theo ngày trong tuần
//                       </Text>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <CalendarOutlined className="text-blue-500" />
//                       <span className="text-blue-600 font-medium">
//                         Phân tích tuần
//                       </span>
//                     </div>
//                   </div>
//                   {loadingBehavior ? (
//                     <div className="flex justify-center items-center h-64">
//                       <Spin size="large" />
//                     </div>
//                   ) : behaviorStats?.weeklyDistribution?.length ? (
//                     <ResponsiveContainer width="100%" height={350}>
//                       <BarChart data={behaviorStats.weeklyDistribution}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                         <XAxis dataKey="day" stroke="#666" />
//                         <YAxis stroke="#666" />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: "#fff",
//                             border: "1px solid #e0e0e0",
//                             borderRadius: "8px",
//                             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//                           }}
//                         />
//                         <Bar
//                           dataKey="count"
//                           fill="#8b5cf6"
//                           radius={[4, 4, 0, 0]}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <Empty description="Không có dữ liệu" />
//                   )}
//                 </Card>
//               </Col>
//             </Row>
//           </div>
//         </TabPane>
//       </Tabs>
//     </div>
//   );
// }
