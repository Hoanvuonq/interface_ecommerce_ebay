// components/NotificationHistory/columns.tsx
import React from "react";
import { Column } from "@/components/DataTable/type";
import { BroadcastHistoryRecord } from "@/layouts/header/_service/notification.service";
import dayjs from "dayjs";
import { cn } from "@/utils/cn";

const audienceColors: Record<string, string> = {
  ALL_BUYERS: "bg-blue-50 text-blue-600 border-blue-100",
  ALL_SHOPS: "bg-green-50 text-green-600 border-green-100",
  ALL_USERS: "bg-purple-50 text-purple-600 border-purple-100",
};

const audienceLabels: Record<string, string> = {
  ALL_BUYERS: "Tất cả Buyers",
  ALL_SHOPS: "Tất cả Shops",
  ALL_USERS: "Tất cả Users",
};

const priorityStyles: Record<string, string> = {
  LOW: "bg-gray-50 text-gray-500 border-gray-100",
  NORMAL: "bg-blue-50 text-blue-500 border-blue-100",
  HIGH: "bg-orange-50 text-orange-600 border-orange-200",
  URGENT: "bg-red-50 text-red-600 border-red-200 animate-pulse",
};

const priorityLabels: Record<string, string> = {
  LOW: "Thấp",
  NORMAL: "Bình thường",
  HIGH: "Cao",
  URGENT: "Khẩn cấp",
};

export const getNotificationColumns = (): Column<BroadcastHistoryRecord>[] => [
  {
    header: "Thời gian gửi",
    render: (item) => (
      <div className="flex flex-col">
        <span className="font-bold text-gray-800">
          {dayjs(item.createdAt).format("DD/MM/YYYY")}
        </span>
        <span className="text-[11px] text-gray-400 font-medium">
          {dayjs(item.createdAt).format("HH:mm:ss")}
        </span>
      </div>
    ),
  },
  {
    header: "Đối tượng",
    render: (item) => (
      <span
        className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider",
          audienceColors[item.targetAudience] || "bg-gray-50",
        )}
      >
        {audienceLabels[item.targetAudience] || item.targetAudience}
      </span>
    ),
  },
  {
    header: "Số người nhận",
    align: "center",
    render: (item) => (
      <span className="text-orange-500 font-black tabular-nums">
        {item.recipientCount.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Loại",
    render: (item) => (
      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold italic">
        #{item.type}
      </span>
    ),
  },
  {
    header: "Ưu tiên",
    render: (item) => (
      <span
        className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-black border uppercase",
          priorityStyles[item.priority],
        )}
      >
        {priorityLabels[item.priority]}
      </span>
    ),
  },
  {
    header: "Tiêu đề & Nội dung",
    className: "max-w-[300px]",
    render: (item) => (
      <div className="flex flex-col gap-1 overflow-hidden">
        <span className="font-bold text-gray-800 truncate">{item.title}</span>
        <span className="text-gray-400 text-xs line-clamp-1 font-normal italic">
          {item.content || "Không có nội dung"}
        </span>
      </div>
    ),
  },
  {
    header: "Hình ảnh",
    align: "center",
    render: (item) =>
      item.imageUrl ? (
        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
          <img
            src={item.imageUrl}
            alt="Noti"
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <span className="text-gray-300">--</span>
      ),
  },
];
