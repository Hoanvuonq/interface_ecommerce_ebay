"use client";

import type { BannerResponseDTO } from "@/app/(main)/(home)/_types/banner.dto";
import { ButtonField, DataTable } from "@/components";
import { cn } from "@/utils/cn";
import { Globe, Layers, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BannerFilters } from "../_components";
import { BannerFilterState } from "../_components/BannerFilters/type";
import BannerForm from "../_components/BannerForm";
import { useBanner } from "../_hooks/useBanner";
import { getBannerColumns } from "./colum";

export const BannerSettingsScreen = () => {
  const {
    loading: bannerLoading,
    banners,
    totalElements,
    searchBanners,
    deleteBanner,
    toggleActive,
  } = useBanner();

  const [filters, setFilters] = useState<BannerFilterState>({
    searchText: "",
    locale: undefined,
    categoryIds: [],
  });

  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerResponseDTO | null>(
    null,
  );

  const loadBanners = useCallback(
    async (overrides?: any) => {
      await searchBanners({
        keyword: (overrides?.keyword ?? filters.searchText.trim()) || undefined,
        locale: filters.locale,
        active: activeTab === "ALL" ? undefined : activeTab === "ACTIVE",
        categoryIds: filters.categoryIds.length
          ? filters.categoryIds
          : undefined,
        page,
        size: pageSize,
        ...overrides,
      });
    },
    [filters, activeTab, page, pageSize, searchBanners],
  );

  useEffect(() => {
    loadBanners();
  }, [page, filters.locale, activeTab, filters.categoryIds, loadBanners]);

  const handleResetFilters = () => {
    setFilters({ searchText: "", locale: undefined, categoryIds: [] });
    setActiveTab("ALL");
    setPage(0);
  };

  const columns = useMemo(
    () =>
      getBannerColumns({
        onEdit: (r) => {
          setEditingBanner(r);
          setIsFormModalOpen(true);
        },
        onDelete: async (r) => {
          if (window.confirm(`Xóa banner "${r.title || r.id}"?`) && r.version) {
            if (await deleteBanner(r.id, r.version.toString())) loadBanners();
          }
        },
        onToggleActive: async (r, checked) => {
          if (
            r.version &&
            (await toggleActive(
              r.id,
              { active: checked },
              r.version.toString(),
            ))
          )
            loadBanners();
        },
      }),
    [banners, deleteBanner, toggleActive, loadBanners],
  );

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
         <h1 className="text-5xl font-bold text-gray-900 tracking-tighter uppercase italic leading-none">
            Quản lý <span className="text-orange-500">Banner</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-700 uppercase mt-2 tracking-widest italic opacity-60">
            Hệ thống quản trị hiển thị tập trung
          </p>
        </div>
        <ButtonField
          htmlType="submit"
          type="login"
          className="w-50 h-14 text-[12px] font-bold rounded-4xl shadow-custom border-0 bg-linear-to-r"
          onClick={() => {
            setEditingBanner(null);
            setIsFormModalOpen(true);
          }}
        >
          <span className="flex gap-2 items-center">
            <Plus
              size={20}
              strokeWidth={4}
              className="group-hover:rotate-90 transition-transform"
            />{" "}
            Khởi tạo Banner
          </span>
        </ButtonField>
      </div>

      <BannerFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={loadBanners}
        onReset={handleResetFilters}
        onRefresh={() => loadBanners()}
        isLoading={bannerLoading}
        categories={[]}
        categoryLoading={false}
      />

      <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 w-fit rounded-3xl border border-gray-200">
        {[
          { key: "ALL", label: "Tất cả", count: totalElements },
          { key: "ACTIVE", label: "Đang chạy" },
          { key: "INACTIVE", label: "Đã ẩn" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(0);
            }}
            className={cn(
              "px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3",
              activeTab === tab.key
                ? "bg-white text-orange-600 shadow-sm ring-1 ring-black/5"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-lg text-[9px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden p-6">
        <DataTable
          data={banners}
          columns={columns}
          loading={bannerLoading}
          rowKey="id"
          page={page}
          size={pageSize}
          totalElements={totalElements}
          onPageChange={setPage}
          headerContent={
            <div className="px-4 py-2 flex items-center gap-4 opacity-80 font-bold text-[10px] uppercase italic">
              <div className="flex items-center gap-1.5 text-orange-500">
                <Globe size={16} /> Live Assets
              </div>
              <div className="w-px h-3 bg-gray-300" />
              <div className="flex items-center gap-1.5 text-blue-500">
                <Layers size={16} /> Optimized
              </div>
            </div>
          }
        />
      </div>

      <BannerForm
        banner={editingBanner}
        open={isFormModalOpen}
        onSuccess={() => {
          setIsFormModalOpen(false);
          loadBanners();
        }}
        onCancel={() => {
          setIsFormModalOpen(false);
          setEditingBanner(null);
        }}
      />
    </div>
  );
};
