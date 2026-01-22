"use client";

import React from "react";
import { FiClock, FiCheck, FiX, FiMessageCircle, FiEye } from "react-icons/fi";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";
import {
  ReturnRequest,
  ReturnStatus,
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import {
  RETURN_STATUS_CONFIG,
  formatDeadlineText,
  getDeadlineColor,
} from "../_constants/order.constants";

interface ReturnColumnsProps {
  onView: (record: ReturnRequest) => void;
  onMessage?: (record: ReturnRequest) => void;
}

export const getReturnColumns = ({
  onView,
  onMessage,
}: ReturnColumnsProps): Column<ReturnRequest>[] => [
  {
    header: "Mã đơn",
    render: (item) => (
      <span className="text-gray-900 font-bold">{item.orderNumber}</span>
    ),
  },
  {
    header: "Loại",
    render: (item) => {
      const typeMap = {
        RETURN_ONLY: {
          text: "Trả hàng",
          class: "bg-blue-50 text-blue-600 border-blue-100",
        },
        RETURN_REFUND: {
          text: "Trả + Hoàn",
          class: "bg-orange-50 text-orange-600 border-orange-100",
        },
        REFUND_ONLY: {
          text: "Hoàn tiền",
          class: "bg-purple-50 text-purple-600 border-purple-100",
        },
      };
      const config = typeMap[item.type];
      return (
        <span
          className={cn(
            "px-2 py-1 rounded-lg text-[10px] font-bold border uppercase",
            config?.class,
          )}
        >
          {config?.text}
        </span>
      );
    },
  },
  {
    header: "Lý do",
    accessor: "reason",
    className: "max-w-[200px] truncate font-normal",
  },
  {
    header: "Người yêu cầu",
    accessor: "requesterName",
  },
  {
    header: "Hạn xử lý",
    render: (item) => {
      const { text, isUrgent } = formatDeadlineText(item.deadline);
      const color = getDeadlineColor(item.deadline);
      return (
        <div className="flex items-center gap-1.5" style={{ color }}>
          <FiClock className={cn(isUrgent && "animate-pulse")} />
          <span className={cn(isUrgent && "font-black")}>{text}</span>
        </div>
      );
    },
  },
  {
    header: "Trạng thái",
    render: (item) => {
      const config = RETURN_STATUS_CONFIG[item.status];
      // Logic kiểm tra màu xanh cho trạng thái thành công
      const isSuccess = item.status === ReturnStatus.APPROVED;

      return (
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full w-fit text-[10px] font-bold border",
            isSuccess
              ? "text-green-600 border-green-100 bg-green-50"
              : "bg-gray-50 text-gray-600 border-gray-200",
          )}
        >
          {config?.text}
        </div>
      );
    },
  },
  {
    header: "Thao tác",
    align: "right",
    render: (item) => (
      <div className="flex items-center justify-end gap-2">
        {item.status === ReturnStatus.PENDING && (
          <>
            <button
              onClick={() => onView(item)}
              className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-colors"
              title="Chấp nhận"
            >
              <FiCheck size={18} />
            </button>
            <button
              onClick={() => onView(item)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Từ chối"
            >
              <FiX size={18} />
            </button>
          </>
        )}
        <button
          onClick={() => onMessage?.(item)}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
          title="Nhắn tin"
        >
          <FiMessageCircle size={18} />
        </button>
        <button
          onClick={() => onView(item)}
          className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"
          title="Xem chi tiết"
        >
          <FiEye size={18} />
        </button>
      </div>
    ),
  },
];
