import React from "react";
import dayjs from "dayjs";
import {
  Eye,
  Edit3,
  Trash2,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  ReportResponse,
  ReportReason,
  ReportStatus,
} from "@/app/(chat)/_types/chat.dto";
import { Column } from "@/components/DataTable/type";
import { ActionBtn } from "@/components";
import { cn } from "@/utils/cn";

interface ReportColumnProps {
  page: number;
  size: number;
  onView: (record: ReportResponse) => void;
  onUpdateStatus: (record: ReportResponse) => void;
  onDelete: (record: ReportResponse) => void;
  renderStatus: (status: ReportStatus) => React.ReactNode;
  renderReason: (reason: ReportReason) => React.ReactNode;
}

export const getReportColumns = ({
  page,
  size,
  onView,
  onUpdateStatus,
  onDelete,
  renderStatus,
  renderReason,
}: ReportColumnProps): Column<ReportResponse>[] => [
  {
    header: "ID",
    align: "center",
    render: (row) => (
      <span className="font-mono text-[11px] font-bold text-gray-400 uppercase italic">
        #{row.id.slice(-8)}
      </span>
    ),
  },
  {
    header: "Người báo cáo",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
          {row.reporterAvatar ? (
            <img
              src={row.reporterAvatar}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User size={14} />
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-800 text-xs truncate uppercase tracking-tighter">
            {row.reporterName}
          </span>
          <span className="text-[9px] font-medium text-gray-400 truncate tracking-tighter uppercase italic">
            ID: {row.reporterId.slice(0, 8)}...
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Đối tượng bị báo cáo",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-rose-50 border border-rose-100">
          {row.reportedUserAvatar ? (
            <img
              src={row.reportedUserAvatar}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-rose-300">
              <User size={14} />
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-800 text-xs truncate uppercase tracking-tighter">
            {row.reportedUserName}
          </span>
          <span className="text-[9px] font-medium text-rose-400 truncate tracking-tighter uppercase italic">
            ID: {row.reportedUserId.slice(0, 8)}...
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Lý do & Trạng thái",
    render: (row) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <AlertCircle size={10} className="text-orange-500" />
          {renderReason(row.reason)}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          {renderStatus(row.status)}
        </div>
      </div>
    ),
  },
  {
    header: "Nội dung mô tả",
    render: (row) => (
      <p className="text-[11px] text-gray-500 line-clamp-2 max-w-50 italic leading-relaxed">
        {row.description}
      </p>
    ),
  },
  {
    header: "Thời gian",
    render: (row) => (
      <div className="flex flex-col text-right">
        <div className="flex items-center justify-end gap-1.5 text-gray-600 font-bold text-[10px]">
          <Calendar size={10} className="text-orange-500" />
          {dayjs(row.createdDate).format("DD/MM/YYYY")}
        </div>
        <span className="text-[9px] font-medium text-gray-400 italic">
          vào lúc {dayjs(row.createdDate).format("HH:mm")}
        </span>
      </div>
    ),
  },
  {
    header: "Thực thi",
    align: "right",
    render: (row) => (
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <ActionBtn
          onClick={() => onView(row)}
          icon={<Eye size={14} />}
          tooltip="Chi tiết hồ sơ"
          color="hover:text-blue-500"
        />
        <ActionBtn
          onClick={() => onUpdateStatus(row)}
          icon={<Edit3 size={14} />}
          tooltip="Xử lý báo cáo"
          color="hover:text-orange-500"
        />
        <ActionBtn
          onClick={() => onDelete(row)}
          icon={<Trash2 size={14} />}
          tooltip="Xóa vĩnh viễn"
          color="hover:text-rose-500"
        />
      </div>
    ),
  },
];
