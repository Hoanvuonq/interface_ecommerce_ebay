"use client";

import {
  StatusTabItem,
  StatusTabs,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";
import { CampaignStatus } from "@/app/(shop)/shop/marketing/campaigns/_types/campaign.type";
import { ButtonField, DataTable } from "@/components";
import {
  Activity,
  Ban,
  CalendarClock,
  CheckCircle2,
  FileEdit,
  LayoutGrid,
  Plus,
} from "lucide-react";
import React, { useMemo } from "react";
import { getCampaignColumns } from "./colum";
import { CampaignListTableProps } from "./type";

export const CampaignListTable: React.FC<CampaignListTableProps> = ({
  data,
  loading,
  statusFilter,
  onStatusFilterChange,
  onQuickCreate,
  onViewStats,
  onSchedule,
  totalElements,
  page,
  onDelete,
  onAddSlot,
  size,
  onPageChange,
  onCancel,
}) => {
  const columns = getCampaignColumns({
    onViewStats,
    onSchedule,
    onAddSlot,
    onCancel,
    onDelete: onDelete!,
    formatDate: (d: any) => new Date(d).toLocaleDateString("vi-VN"),
  });

  const campaignStatusTabs: StatusTabItem<CampaignStatus | "ALL">[] = useMemo(
    () => [
      { key: "ALL", label: "Tất cả", icon: LayoutGrid },
      { key: "ACTIVE", label: "Hoạt động", icon: Activity },
      { key: "SCHEDULED", label: "Sắp diễn ra", icon: CalendarClock },
      { key: "DRAFT", label: "Bản nháp", icon: FileEdit },
      { key: "ENDED", label: "Kết thúc", icon: CheckCircle2 },
      { key: "CANCELLED", label: "Đã hủy", icon: Ban },
    ],
    [],
  );

  const header = (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <h2 className="font-bold text-xl text-gray-900 uppercase tracking-tight italic">
          Platform Campaigns
        </h2>

        <ButtonField
          type="login"
          onClick={onQuickCreate}
          className="w-60 rounded-xl text-[12px] font-bold uppercase shadow-lg shadow-orange-200"
        >
          <span className="flex gap-2 items-center">
            <Plus size={16} strokeWidth={3} /> Tạo Campaign mới
          </span>
        </ButtonField>
      </div>

      <StatusTabs
        tabs={campaignStatusTabs}
        current={statusFilter}
        onChange={onStatusFilterChange}
        layoutId="platform-campaigns"
      />
    </div>
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      headerContent={header}
      rowKey="id"
      page={page}
      size={size}
      totalElements={totalElements}
      onPageChange={onPageChange}
      emptyMessage="Không tìm thấy chiến dịch nào phù hợp"
    />
  );
};
