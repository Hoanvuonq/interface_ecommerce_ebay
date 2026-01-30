import { Column } from "@/components/DataTable/type";
import { CampaignResponse } from "../../_types/types";
import {
  getStatusColor,
  getStatusLabel,
} from "../../../_constants/getStatusColor";
// Thêm icon PlusSquare hoặc CalendarPlus để đại diện cho việc thêm Slot
import {
  BarChart3,
  Play,
  Ban,
  Store,
  ShieldCheck,
  Trash2,
  PlusSquare,
} from "lucide-react";
import { ActionBtn } from "@/components";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { toPublicUrl } from "@/utils/storage/url";

interface CampaignColumnsProps {
  onViewStats: (campaign: CampaignResponse) => void;
  onSchedule: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSlot: (id: string) => void; // Bổ sung prop xử lý thêm Slot
  formatDate: (date: string) => string;
}

export const getCampaignColumns = ({
  onViewStats,
  onSchedule,
  onCancel,
  onDelete,
  onAddSlot, // Destructure hàm onAddSlot
  formatDate,
}: CampaignColumnsProps): Column<CampaignResponse>[] => [
  // ... (Các cột khác giữ nguyên)
  {
    header: "Chiến dịch",
    render: (campaign) => {
      const thumbSrc = campaign.thumbnailUrl
        ? toPublicUrl(campaign.thumbnailUrl)
        : "https://picsum.photos/100/100";

      return (
        <div className="flex items-center gap-4 py-1">
          <div className="relative w-16 h-16 shrink-0 border-2 border-orange-100 rounded-xl overflow-hidden shadow-sm">
            <Image
              src={thumbSrc}
              alt={campaign.name}
              fill
              priority
              sizes="48px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="font-bold text-gray-900 truncate leading-tight">
              {campaign.name}
            </p>
            <p className="text-[11px] text-gray-600 truncate max-w-45 font-medium mt-0.5 italic">
              {campaign.description}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Phân loại",
    render: (campaign) => (
      <div className="flex flex-col gap-1">
        <span className="w-fit px-2 py-0.5 bg-orange-50 text-orange-600 text-[12px] font-bold rounded-md border border-orange-100 uppercase tracking-tighter">
          {campaign.campaignType}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-600 uppercase">
          {campaign.sponsorType === "PLATFORM" ? (
            <ShieldCheck size={16} className="text-blue-500" />
          ) : (
            <Store size={16} className="text-orange-400" />
          )}
          {campaign.sponsorType}
        </div>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    render: (campaign) => (
      <span
        className={cn(
          "px-3 py-1 text-[10px] font-extrabold rounded-full border shadow-xs uppercase tracking-wider",
          getStatusColor(campaign.status),
        )}
      >
        {getStatusLabel(campaign.status)}
      </span>
    ),
  },
  {
    header: "Thời gian",
    render: (campaign) => (
      <div className="flex flex-col gap-0.5 text-[12px]">
        <div className="flex items-center gap-1 text-gray-600 font-bold">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          {formatDate(campaign.startDate)}
        </div>
        <div className="flex items-center gap-1 text-gray-600 font-bold">
          <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
          {formatDate(campaign.endDate)}
        </div>
      </div>
    ),
  },
  {
    header: "Hiệu năng",
    render: (campaign) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-bold text-gray-600 uppercase">
            Slots:
          </span>
          <span className="text-xs font-bold text-gray-700">
            {campaign.totalSlots || 0}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-bold text-gray-600 uppercase">
            Sản phẩm:
          </span>
          <span className="text-xs font-bold text-orange-500">
            {campaign.totalProducts || 0}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Tác vụ",
    align: "right",
    render: (campaign) => (
      <div className="flex items-center justify-end gap-1.5">
        <ActionBtn
          icon={<BarChart3 size={14} />}
          onClick={() => onViewStats(campaign)}
          tooltip="Thống kê"
          color="bg-white text-orange-500 hover:bg-orange-50 border-orange-100"
        />

        {/* NÚT THÊM KHUNG GIỜ (ADD SLOT) */}
        <ActionBtn
          icon={<PlusSquare size={14} />}
          onClick={() => onAddSlot(campaign.id)}
          tooltip="Thêm Khung Giờ"
          color="bg-white text-orange-600 hover:bg-orange-50 border-orange-100 shadow-sm"
        />

        <ActionBtn
          icon={<Trash2 size={14} />}
          onClick={() => onDelete(campaign.id)}
          tooltip="Xóa Chiến Dịch"
          color="bg-white text-rose-500 hover:bg-rose-50 border-rose-100"
        />

        {campaign.status === "DRAFT" && (
          <ActionBtn
            icon={<Play size={14} />}
            onClick={() => onSchedule(campaign.id)}
            tooltip="Kích hoạt"
            color="bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200"
          />
        )}

        {["ACTIVE", "SCHEDULED"].includes(campaign.status) && (
          <ActionBtn
            icon={<Ban size={14} />}
            onClick={() => onCancel(campaign.id)}
            tooltip="Dừng chiến dịch"
            color="bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border-rose-100"
          />
        )}
      </div>
    ),
  },
];
