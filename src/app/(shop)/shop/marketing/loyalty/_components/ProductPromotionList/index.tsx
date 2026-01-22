"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Gift,
  Percent,
  Hash,
  RefreshCw,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  MoreVertical
} from "lucide-react";
import { DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
import { loyaltyService } from "../../_services/loyalty.service";
import type { ProductLoyaltyPromotionResponse, PromotionStatus } from "../../_types/loyalty.types";
import { ProductPromotionForm } from "../ProductPromotionForm";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import Image from "next/image";

interface ProductPromotionListProps {
  onCountUpdate?: (count: number) => void;
}

const ProductPromotionList: React.FC<ProductPromotionListProps> = ({ onCountUpdate }) => {
  const [promotions, setPromotions] = useState<ProductLoyaltyPromotionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<PromotionStatus | "ALL">("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<ProductLoyaltyPromotionResponse | null>(null);

  const { success: toastSuccess, error: toastError } = useToast();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const data = await loyaltyService.getPromotions();
      setPromotions(data);
      onCountUpdate?.(data.length);
    } catch (error) {
      toastError("Không thể tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (promotionId: string) => {
    try {
      const result = await loyaltyService.togglePromotion(promotionId);
      setPromotions(prev => prev.map(p => (p.id === promotionId ? result : p)));
      toastSuccess(`Khuyến mãi đã ${result.enabled ? "bật" : "tắt"}`);
    } catch (error) {
      toastError("Không thể thay đổi trạng thái");
    }
  };

  const handleDelete = async (promotionId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể hoàn tác.")) return;
    try {
      await loyaltyService.deletePromotion(promotionId);
      setPromotions(prev => prev.filter(p => p.id !== promotionId));
      toastSuccess("Đã xóa khuyến mãi");
    } catch (error) {
      toastError("Không thể xóa khuyến mãi");
    }
  };

  const getStatusStyle = (status: PromotionStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "SCHEDULED":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "ENDED":
        return "bg-slate-50 text-slate-500 border-slate-100";
      case "DISABLED":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-500";
    }
  };

  const filteredData = useMemo(() => {
    return promotions.filter(p => {
      const matchSearch = p.productName?.toLowerCase().includes(searchText.toLowerCase()) ||
        p.name?.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [promotions, searchText, statusFilter]);

  const columns: Column<ProductLoyaltyPromotionResponse>[] = [
    {
      header: "Sản phẩm",
      render: (record) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {record.productThumbnail ? (
              <Image src={record.productThumbnail} alt="" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Gift className="text-slate-300" size={20} /></div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-800 truncate leading-tight">
              {record.productName || "N/A"}
            </span>
            {record.name && <span className="text-[11px] text-slate-400 truncate italic">{record.name}</span>}
          </div>
        </div>
      ),
    },
    {
      header: "Quy tắc",
      render: (record) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
            {record.ruleType === "FIXED" ? <Hash size={14} className="text-blue-500" /> : <Percent size={14} className="text-emerald-500" />}
            <span>{record.ruleType === "FIXED" ? `+${record.ruleValue} điểm` : `+${record.ruleValue}% giá`}</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-medium tracking-tighter">Mỗi sản phẩm</span>
        </div>
      ),
    },
    {
      header: "Thời gian",
      render: (record) => (
        <div className="flex flex-col gap-0.5 text-[11px] font-bold">
          <div className="flex items-center gap-1 text-slate-600">
            <Calendar size={12} className="text-slate-400" />
            {new Date(record.startDate).toLocaleDateString("vi-VN")}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <div className="w-3" />
            <span className="font-medium italic">đến</span>
            {new Date(record.endDate).toLocaleDateString("vi-VN")}
          </div>
        </div>
      ),
    },
    {
      header: "Trạng thái",
      render: (record) => (
        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", getStatusStyle(record.status))}>
          {record.status === "ACTIVE" ? "Đang chạy" : record.status === "SCHEDULED" ? "Sắp diễn ra" : record.status === "ENDED" ? "Kết thúc" : "Đã tắt"}
        </span>
      ),
    },
    {
      header: "Bật/Tắt",
      align: "center",
      render: (record) => (
        <button
          onClick={() => handleToggle(record.id)}
          className={cn(
            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
            record.enabled ? "bg-orange-500" : "bg-slate-200"
          )}
        >
          <span className={cn("inline-block h-3 w-3 transform rounded-full bg-white transition-transform", record.enabled ? "translate-x-5" : "translate-x-1")} />
        </button>
      ),
    },
    {
      header: "Thao tác",
      align: "right",
      render: (record) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => { setEditingPromotion(record); setIsFormOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(record.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-2xl text-orange-500 shadow-sm"><Gift size={24} /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Khuyến mãi sản phẩm</h2>
            <p className="text-xs text-slate-400 font-medium italic mt-1">Tích điểm thưởng khi mua các sản phẩm cụ thể</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchPromotions} disabled={loading} className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all active:scale-95">
            <RefreshCw size={18} className={cn(loading && "animate-spin")} />
          </button>
          <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95">
            <Plus size={16} strokeWidth={3} /> Tạo mới
          </button>
        </div>
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        loading={loading}
        totalElements={filteredData.length}
        page={0}
        size={filteredData.length}
        onPageChange={() => {}}
        rowKey="id"
        emptyMessage="Chưa có chương trình khuyến mãi nào được tạo."
        headerContent={
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative group min-w-70">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm hoặc tên CT..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:border-orange-500 transition-all"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang chạy</option>
              <option value="SCHEDULED">Sắp diễn ra</option>
              <option value="ENDED">Kết thúc</option>
              <option value="DISABLED">Đã tắt</option>
            </select>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
              Tổng: {filteredData.length}
            </span>
          </div>
        }
      />

      <ProductPromotionForm
        open={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingPromotion(null); }}
        onSuccess={() => { fetchPromotions(); setIsFormOpen(false); setEditingPromotion(null); }}
        editPromotion={editingPromotion}
      />
    </div>
  );
};

export default ProductPromotionList;