"use client";

import {
  CheckCircle2,
  Clock,
  Eraser,
  LayoutGrid,
  MessageSquare,
  RotateCw,
  Search,
  XCircle,
  ShieldCheck, // Thêm icon mới
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useReports } from "@/app/(chat)/_hooks";
import {
  GetReportsRequest,
  ReportReason,
  ReportResponse,
  ReportStatus,
} from "@/app/(chat)/_types/chat.dto";
// Loại bỏ StatusTabs bị lỗi
import {
  DataTable,
  FormInput,
  SearchComponent,
  SelectComponent,
  StatCardComponents,
} from "@/components";
import { cn } from "@/utils/cn";
import { ReportDetailModal } from "../ReportDetailModal";
import { ReportStatusModal } from "../ReportStatusModal";
import { getReportColumns } from "./colum";

interface ReportTableProps {
  onViewReport?: (report: ReportResponse) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({ onViewReport }) => {
  const [activeTab, setActiveTab] = useState<string>("ALL");

  // Filters
  const [filters, setFilters] = useState<GetReportsRequest>({
    page: 0,
    size: 10,
  });

  // Modals
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(
    null,
  );

  // ==================== HOOKS ====================
  const { reports, loading, refresh, updateReportStatus, deleteReport } =
    useReports(filters);

  // ==================== STATISTICS ====================
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    resolved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const stats = reports.reduce(
      (acc, report) => {
        acc.total++;
        if (report.status === ReportStatus.PENDING) acc.pending++;
        if (report.status === ReportStatus.REVIEWED) acc.reviewed++;
        if (report.status === ReportStatus.RESOLVED) acc.resolved++;
        if (report.status === ReportStatus.REJECTED) acc.rejected++;
        return acc;
      },
      { total: 0, pending: 0, reviewed: 0, resolved: 0, rejected: 0 },
    );
    setStatistics(stats);
  }, [reports]);

  // ==================== HANDLERS ====================

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 0,
    }));
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    handleFilterChange("status", key === "ALL" ? undefined : key);
  };

  const openDetailModal = (report: ReportResponse) => {
    setSelectedReport(report);
    setDetailModalOpen(true);
    onViewReport?.(report);
  };

  const openStatusModal = (report: ReportResponse) => {
    setSelectedReport(report);
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (values: {
    status: ReportStatus;
    adminNote?: string;
  }) => {
    if (!selectedReport) return;
    try {
      await updateReportStatus(
        selectedReport.id,
        values.status,
        values.adminNote,
      );
      setStatusModalOpen(false);
    } catch (error) {
      console.error("Update status failed:", error);
    }
  };

  const handleDeleteReport = async (report: ReportResponse) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa báo cáo #${report.id}?`)) {
      try {
        await deleteReport(report.id);
      } catch (error) {
        console.error("Delete report failed:", error);
      }
    }
  };

  const handleResetFilters = () => {
    setFilters({ page: 0, size: 10 });
    setActiveTab("ALL");
  };

  // ==================== RENDER HELPERS ====================

  const renderStatus = (status: ReportStatus) => {
    const configs: any = {
      [ReportStatus.PENDING]: "bg-orange-50 text-orange-600 border-orange-100",
      [ReportStatus.REVIEWED]: "bg-blue-50 text-blue-600 border-blue-100",
      [ReportStatus.RESOLVED]:
        "bg-emerald-50 text-emerald-600 border-emerald-100",
      [ReportStatus.REJECTED]: "bg-rose-50 text-rose-600 border-rose-100",
    };
    const labels: any = {
      [ReportStatus.PENDING]: "Chờ xử lý",
      [ReportStatus.REVIEWED]: "Đã xem xét",
      [ReportStatus.RESOLVED]: "Đã giải quyết",
      [ReportStatus.REJECTED]: "Từ chối",
    };
    return (
      <span
        className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-tighter shadow-xs",
          configs[status] || "bg-gray-100 text-gray-500",
        )}
      >
        {labels[status] || status}
      </span>
    );
  };

  const renderReason = (reason: ReportReason) => {
    const configs: any = {
      [ReportReason.SPAM]: "bg-slate-100 text-slate-600",
      [ReportReason.HARASSMENT]: "bg-rose-100 text-rose-600",
      [ReportReason.INAPPROPRIATE_CONTENT]: "bg-amber-100 text-amber-600",
      [ReportReason.SCAM]: "bg-orange-100 text-orange-600",
    };
    return (
      <span
        className={cn(
          "px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-tight",
          configs[reason] || "bg-gray-100 text-gray-600",
        )}
      >
        {reason}
      </span>
    );
  };

  const columns = useMemo(
    () =>
      getReportColumns({
        page: filters.page || 0,
        size: filters.size || 10,
        onView: openDetailModal,
        onUpdateStatus: openStatusModal,
        onDelete: handleDeleteReport,
        renderStatus,
        renderReason,
      }),
    [filters.page, filters.size, reports],
  );

  const tableHeader = (
    <div className="flex items-center gap-4 p-2">
      <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shadow-sm">
        <MessageSquare size={20} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest leading-none">
          Report Registry
        </h3>
        <p className="text-[10px] font-bold text-gray-400 mt-1 italic uppercase">
          Hệ thống giám sát vi phạm cộng đồng
        </p>
      </div>
    </div>
  );

  const tabs = [
    {
      key: "ALL",
      label: "Tất cả",
      icon: LayoutGrid,
      count: statistics.total,
      color: "text-gray-500",
    },
    {
      key: ReportStatus.PENDING,
      label: "Chờ xử lý",
      icon: Clock,
      count: statistics.pending,
      color: "text-orange-500",
    },
    {
      key: ReportStatus.REVIEWED,
      label: "Đã xem xét",
      icon: Search,
      count: statistics.reviewed,
      color: "text-blue-500",
    },
    {
      key: ReportStatus.RESOLVED,
      label: "Đã giải quyết",
      icon: CheckCircle2,
      count: statistics.resolved,
      color: "text-emerald-500",
    },
    {
      key: ReportStatus.REJECTED,
      label: "Từ chối",
      icon: XCircle,
      count: statistics.rejected,
      color: "text-rose-500",
    },
  ];

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {tabs.map((tab) => (
          <StatCardComponents
            key={tab.key}
            label={tab.label}
            value={tab.count}
            icon={<tab.icon />}
            color={tab.color}
            trend={tab.key === ReportStatus.PENDING && tab.count > 0 ? 10 : 0}
          />
        ))}
      </div>

      <div className="bg-white rounded-4xl p-4 border border-gray-100 shadow-custom overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Thay thế StatusTabs bằng hệ thống Button Tab mới */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-50 rounded-4xl border border-gray-100">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95",
                      isActive
                        ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50",
                    )}
                  >
                    <tab.icon
                      size={14}
                      className={cn(isActive ? tab.color : "text-current")}
                    />
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className={cn(
                          "ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                          isActive
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-gray-500",
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-90"
                title="Xóa bộ lọc"
              >
                <Eraser size={18} />
              </button>
              <button
                onClick={refresh}
                className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-90"
                title="Làm mới"
              >
                <RotateCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <SearchComponent
              value={filters.keyword || ""}
              onChange={(value) => handleFilterChange("keyword", value)}
              placeholder="Tìm mã báo cáo hoặc mô tả vi phạm..."
              size="md"
              className="md:col-span-6"
            />

            <div className="md:col-span-3">
              <SelectComponent
                placeholder="Lý do vi phạm"
                options={Object.values(ReportReason).map((reason) => ({
                  label: reason,
                  value: reason,
                }))}
                value={filters.reason}
                onChange={(val) => handleFilterChange("reason", val)}
                className="rounded-2xl h-12 shadow-sm"
              />
            </div>

            <div className="md:col-span-3">
              <SelectComponent
                options={[10, 20, 50].map((v) => ({
                  label: `Hiện ${v} dòng`,
                  value: String(v),
                }))}
                value={String(filters.size)}
                onChange={(val) => handleFilterChange("size", Number(val))}
                className="rounded-2xl h-12 shadow-sm"
              />
            </div>
          </div>
        </div>

        <DataTable<ReportResponse>
          data={reports}
          columns={columns}
          loading={loading}
          rowKey="id"
          page={filters.page || 0}
          size={filters.size || 10}
          totalElements={reports.length}
          onPageChange={(newPage) => handleFilterChange("page", newPage)}
          headerContent={tableHeader}
        />
      </div>

      <ReportDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        selectedReport={selectedReport}
        onUpdateStatus={(report) => {
          setDetailModalOpen(false);
          openStatusModal(report);
        }}
        renderStatus={renderStatus}
        renderReason={renderReason}
      />

      <ReportStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        selectedReport={selectedReport}
        loading={loading}
        onSubmit={async (values) => {
          await handleUpdateStatus(values);
        }}
      />
    </div>
  );
};
