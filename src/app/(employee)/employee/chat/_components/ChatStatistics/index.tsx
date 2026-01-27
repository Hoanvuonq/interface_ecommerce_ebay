"use client";

import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  Users,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Calendar,
  RotateCw,
  Search,
  Filter,
} from "lucide-react";

import { useChatStatistics } from "@/app/(chat)/_hooks";
import {
  ConversationType,
  GetChatStatisticsRequest,
  MessageType,
  ReportStatus,
} from "@/app/(chat)/_types/chat.dto";
import { getTopUserColumns } from "./colum";
import {
  DataTable,
  SelectComponent,
  StatCardComponents,
  FormInput,
} from "@/components";
import { cn } from "@/utils/cn";

interface ChatStatisticsProps {
  height?: number;
}

export const ChatStatistics: React.FC<ChatStatisticsProps> = ({
  height = 800,
}) => {
  // ==================== STATE ====================
  const [filters, setFilters] = useState<GetChatStatisticsRequest>({
    startDate: dayjs().subtract(30, "day").toISOString(),
    endDate: dayjs().toISOString(),
  });

  // ==================== HOOKS ====================
  const { statistics, loading, error, refresh } = useChatStatistics(filters);

  // ==================== HANDLERS ====================
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Colors for charts
  const COLORS = [
    "#f97316",
    "#3b82f6",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#f59e0b",
    "#06b6d4",
    "#ec4899",
  ];

  // ==================== RENDER HELPERS ====================
  const getConversationTypeText = (type: ConversationType) => {
    const map: any = {
      [ConversationType.BUYER_TO_SHOP]: "Khách - Shop",
      [ConversationType.BUYER_TO_PLATFORM]: "Khách - CSKH",
      [ConversationType.SHOP_TO_PLATFORM]: "Shop - Admin",
      [ConversationType.GROUP]: "Nhóm",
      [ConversationType.BUYER_TO_BUYER]: "Khách - Khách",
      [ConversationType.SYSTEM]: "Hệ thống",
    };
    return map[type] || type;
  };

  const getMessageTypeText = (type: MessageType) => {
    const map: any = {
      [MessageType.TEXT]: "Văn bản",
      [MessageType.IMAGE]: "Hình ảnh",
      [MessageType.VIDEO]: "Video",
      [MessageType.FILE]: "File",
      [MessageType.AUDIO]: "Âm thanh",
      [MessageType.STICKER]: "Sticker",
      [MessageType.PRODUCT_CARD]: "Sản phẩm",
      [MessageType.ORDER_CARD]: "Đơn hàng",
      [MessageType.VOUCHER_CARD]: "Voucher",
      [MessageType.LOCATION]: "Vị trí",
      [MessageType.SYSTEM]: "Hệ thống",
    };
    return map[type] || type;
  };

  const getReportStatusText = (status: ReportStatus) => {
    const map: any = {
      [ReportStatus.PENDING]: "Chờ xử lý",
      [ReportStatus.REVIEWED]: "Đã xem xét",
      [ReportStatus.RESOLVED]: "Đã giải quyết",
      [ReportStatus.REJECTED]: "Từ chối",
    };
    return map[status] || status;
  };

  // Memoized Chart Data
  const conversationPieData = useMemo(
    () =>
      statistics
        ? Object.entries(statistics.conversationsByType).map(
            ([type, count], index) => ({
              name: getConversationTypeText(type as ConversationType),
              value: count,
              color: COLORS[index % COLORS.length],
            }),
          )
        : [],
    [statistics],
  );

  const messageBarData = useMemo(
    () =>
      statistics
        ? Object.entries(statistics.messagesByType).map(([type, count]) => ({
            name: getMessageTypeText(type as MessageType),
            value: count,
          }))
        : [],
    [statistics],
  );

  if (loading && !statistics) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-40 bg-white rounded-4xl border border-gray-100 shadow-sm">
        <RotateCw className="w-10 h-10 text-orange-500 animate-spin" />
        <span className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
          Đang khởi tạo dữ liệu...
        </span>
      </div>
    );
  }

  const columns = useMemo(() => getTopUserColumns(), []);

  const tableHeader = (
    <div className="flex items-center gap-4 p-2">
      <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shadow-sm">
        <TrendingUp size={20} strokeWidth={3} />
      </div>
      <div>
        <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest leading-none">
          Top Active Users
        </h3>
        <p className="text-[10px] font-bold text-gray-400 mt-1 italic">
          Xếp hạng cường độ tương tác thời gian thực
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700 pb-10">
      {/* 1. Toolbar Filters */}
      <div className="bg-white p-4 rounded-4xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
          <Calendar size={16} className="text-orange-500" />
          <span className="text-xs font-bold text-gray-600 tracking-tight">
            {dayjs(filters.startDate).format("DD/MM/YYYY")} -{" "}
            {dayjs(filters.endDate).format("DD/MM/YYYY")}
          </span>
        </div>

        <div className="w-64">
          <SelectComponent
            placeholder="Loại hội thoại"
            options={Object.values(ConversationType).map((type) => ({
              label: getConversationTypeText(type),
              value: type,
            }))}
            value={filters.conversationType}
            onChange={(val) => handleFilterChange("conversationType", val)}
            className="rounded-xl h-11"
          />
        </div>

        <button
          onClick={refresh}
          className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-90 shrink-0"
        >
          <RotateCw size={18} />
        </button>
      </div>

      {/* 2. Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardComponents
          label="Tổng cuộc trò chuyện"
          value={statistics?.totalConversations || 0}
          icon={<Users />}
          color="text-blue-600"
        />
        <StatCardComponents
          label="Tổng tin nhắn"
          value={statistics?.totalMessages || 0}
          icon={<MessageSquare />}
          color="text-emerald-600"
        />
        <StatCardComponents
          label="Tổng báo cáo"
          value={statistics?.totalReports || 0}
          icon={<AlertTriangle />}
          color="text-amber-500"
        />
        <StatCardComponents
          label="Hội thoại hoạt động"
          value={statistics?.activeConversations || 0}
          icon={<ShieldCheck />}
          color="text-orange-600"
        />
      </div>

      {/* 3. Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Báo cáo chờ xử lý
            </span>
            <AlertTriangle size={16} className="text-rose-500" />
          </div>
          <div className="text-3xl font-bold text-rose-500 italic">
            {statistics?.pendingReports || 0}
          </div>
          {statistics && statistics.totalReports > 0 && (
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(statistics.pendingReports / statistics.totalReports) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
        <StatCardComponents
          label="Tổng người dùng"
          value={statistics?.totalUsers || 0}
          icon={<Users />}
          color="text-cyan-600"
        />
        <StatCardComponents
          label="Phản hồi TB (phút)"
          value={statistics?.averageResponseTime || 0}
          icon={<Clock />}
          color="text-pink-600"
        />
      </div>

      {/* 4. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversation Pie */}
        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-800 mb-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Phân bố
            loại hội thoại
          </h4>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversationPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {conversationPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Message Bar */}
        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-800 mb-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Phân bố
            loại tin nhắn
          </h4>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messageBarData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                />
                <RechartsTooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "16px", border: "none" }}
                />
                <Bar
                  dataKey="value"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Daily Activity Area Chart */}
      <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-800 mb-8 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Biểu đồ
          hoạt động hàng ngày
        </h4>
        <div className="h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={statistics?.dailyMessageCount || []}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                tickFormatter={(val) => dayjs(val).format("DD/MM")}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              />
              <RechartsTooltip
                contentStyle={{ borderRadius: "16px", border: "none" }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#f97316"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-2 border border-gray-100 shadow-custom overflow-hidden">
        <DataTable
          data={statistics?.topActiveUsers || []}
          columns={columns}
          loading={false}
          rowKey="userId"
          page={0}
          size={statistics?.topActiveUsers?.length || 10}
          totalElements={statistics?.topActiveUsers?.length || 0}
          onPageChange={() => {}}
          headerContent={tableHeader}
          emptyMessage="Chưa có dữ liệu xếp hạng người dùng"
        />
      </div>
    </div>
  );
};
