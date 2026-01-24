"use client";

import { useMemo } from "react";
import { VoucherTemplate } from "../../_types/voucher-v2.type";
import { getTemplateColumns } from "./column";
import { TemplateTableProps } from "./type";
import { DataTable } from "@/components";
import { useToast } from "@/hooks/useToast";

export const TemplateTable = ({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onCheckUsage,
  onUsePlatform,
}: TemplateTableProps) => {
  const { success } = useToast();

  const columns = useMemo(
    () =>
      getTemplateColumns(
        onView,
        onEdit,
        onDelete,
        onCheckUsage,
        onUsePlatform,
        onToggleStatus,
        success,
      ),
    [
      onView,
      onEdit,
      onDelete,
      onCheckUsage,
      onUsePlatform,
      onToggleStatus,
      success,
    ],
  );

  return (
    <div className="animate-in fade-in duration-700 shadow-custom rounded-[2.5rem] overflow-hidden border border-gray-100">
      <DataTable<VoucherTemplate>
        data={data}
        columns={columns}
        loading={loading}
        rowKey="id"
        size={10}
        page={0}
        totalElements={data.length}
        onPageChange={() => {}}
        emptyMessage="Không tìm thấy Voucher Template nào trong Protocol"
      />
    </div>
  );
};
