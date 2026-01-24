"use client";

import { ActionBtn, FormInput } from "@/components";
import { cn } from "@/utils/cn";
import {
  Activity,
  DollarSign,
  FilterX,
  Gift,
  LayoutGrid,
  RefreshCw,
  Search,
  Zap,
} from "lucide-react";
import {
  CheckUsageModal,
  TemplateFormModal,
  TemplateTable,
  ValidateVouchersModal,
  VoucherDetailModal,
} from "../_components";
import { useVoucherTableLogic } from "../_hooks/useVoucherTableLogic";

export default function AdminVoucherV2Page() {
  const logic = useVoucherTableLogic();

  return (
    <div className="min-h-screen space-y-4 animate-in fade-in duration-700">
      <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-slate-200/50">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap size={160} className="text-orange-500" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold  text-gray-900 uppercase tracking-tighter italic leading-none">
              Quản lý <span className="text-orange-500">Voucher</span>
            </h1>
            <p className="text-[11px] font-bold  text-gray-400 uppercase tracking-[0.3em] ml-1">
              Voucher Protocol Management v4.0
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionBtn
              label="Tạo PAID Template"
              icon={<DollarSign size={16} />}
              onClick={() => logic.setCreateModal(true, "paid")}
              color="bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200"
            />
            <ActionBtn
              label="Tạo DIRECT Voucher"
              icon={<Gift size={16} />}
              onClick={() => logic.setCreateModal(true, "direct")}
              color="bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tổng Templates" value={logic.total} color="blue" />
        <StatCard
          title="Platform Sponsor"
          value={logic.platformCount}
          color="emerald"
        />
        <StatCard title="Shop Sponsor" value={logic.shopCount} color="purple" />
        <StatCard
          title="Đang kích hoạt"
          value={logic.activeCount}
          color="orange"
          suffix={`/ ${logic.total}`}
        />
      </div>

      <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2  text-gray-400 group-focus-within:text-orange-500 z-10"
              size={18}
            />
            <FormInput
              placeholder="Truy vấn mã định danh, tên chiến dịch..."
              value={logic.filters.q}
              onChange={(e) => logic.setFilters({ q: e.target.value })}
              className="pl-12 h-14 bg-slate-50/50 rounded-2xl border-transparent focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logic.clearFilters}
              className="p-4 rounded-2xl bg-slate-100  text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95 shadow-sm"
              title="Xóa bộ lọc"
            >
              <FilterX size={20} />
            </button>
            <button
              onClick={logic.refresh}
              className={cn(
                "p-4 rounded-2xl bg-slate-100  text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95 shadow-sm",
                logic.isRefetching &&
                  "animate-spin text-orange-500 bg-orange-50",
              )}
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-50">
          <ActionBtn
            label="Validate Hệ thống"
            icon={<Activity size={14} />}
            onClick={() => logic.setValidateModal(true)}
            color="bg-white  text-gray-600 border border-slate-200"
          />
          <ActionBtn
            label="Kiểm tra khả dụng"
            icon={<Zap size={14} />}
            onClick={() => logic.setCheckUsageModal(true)}
            color="bg-white  text-gray-600 border border-slate-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
        <TemplateTable
          data={logic.templates}
          loading={logic.isLoading}
          onView={(r) => logic.setDetailModal(true, r.id)}
          onCheckUsage={(r) => {
            logic.setDetailModal(true, r.id);
            logic.setCheckUsageModal(true);
          }}
          onUsePlatform={logic.handleUsePlatform}
          onDelete={(r) => logic.handleDelete(r.id)}
          onToggleStatus={logic.handleToggleStatus}
        />
      </div>


      <TemplateFormModal
        open={logic.createModal.open}
        mode={logic.createModal.mode}
        onClose={() => logic.setCreateModal(false)}
        onSubmit={logic.handleCreate}
        loading={logic.isLoading}
      />

      <VoucherDetailModal
        open={logic.detailModal.open}
        onClose={() => logic.setDetailModal(false)}
        template={logic.templates.find(
          (t) => t.id === logic.detailModal.selectedId,
        )}
        voucherInfo={logic.voucherInfo || null}
        isLoading={logic.isLoadingInfo}
        onUseInstance={logic.handleUseInstance}
      />

      <ValidateVouchersModal
        open={logic.validateModalOpen}
        onClose={() => logic.setValidateModal(false)}
        onValidate={(codes) => logic.handleValidate(codes).then((r) => r.data)}
      />

      {/* Check Usage Modal */}
      <CheckUsageModal
        open={logic.checkUsageModalOpen}
        onClose={() => logic.setCheckUsageModal(false)}
        onCheckUsage={async (id) => {
          const res = await logic.handleCheckUsage(id);
          return res.data;
        }}
        onGetInfo={(id) => logic.handleGetInfo(id)}
      />
    </div>
  );
}

const StatCard = ({ title, value, color, suffix }: any) => {
  const colors: any = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
  };
  return (
    <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-md flex items-center gap-5 transition-all hover:scale-[1.02]">
      <div className={cn("p-4 rounded-2xl shadow-inner", colors[color])}>
        <LayoutGrid size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase  text-gray-400 tracking-widest mb-1">
          {title}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold  text-gray-800 italic">
            {value}
          </span>
          {suffix && (
            <span className="text-xs font-bold  text-gray-300">{suffix}</span>
          )}
        </div>
      </div>
    </div>
  );
};
