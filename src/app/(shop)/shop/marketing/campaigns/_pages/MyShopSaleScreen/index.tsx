"use client";

import {
  MousePointerClick,
  PackageOpen,
  Plus,
  Tag,
  TrendingUp
} from "lucide-react";
import Image from "next/image";
import { useShopCampaign } from "../../../_hooks/useShopCampaign";
import { useCampaignStore } from "../../../_stores/campaign.store";
import {
  CampaignSidebarCard,
  CreateCampaignModal,
  ProductAnalyticsCard,
} from "../../_components";

export const MyShopSaleScreen = ({
  myCampaigns,
  selectedCampaign,
  selectedCampaignProducts,
  onSelectCampaign,
  onToggleStatus,
  onAddNew,
  onAddProducts,
  formatPrice,
  getDisplayStatus,
}: any) => {
  const showCreateModal = useCampaignStore((s) => s.showCreateModal);
  const setShowCreateModal = useCampaignStore((s) => s.setShowCreateModal);
  const createStep = useCampaignStore((s) => s.createStep);
  const setCreateStep = useCampaignStore((s) => s.setCreateStep);
  const createForm = useCampaignStore((s) => s.createForm);
  const setCreateForm = useCampaignStore((s) => s.setCreateForm);
  const selectedVariants = useCampaignStore((s) => s.selectedVariants);
  const setSelectedVariantsStore = useCampaignStore((s) => s.setSelectedVariants);
  const myProducts = useCampaignStore((s) => s.myProducts);

  const setSelectedVariants = (value: any) => {
    if (typeof value === "function") {
      setSelectedVariantsStore(value(selectedVariants));
    } else {
      setSelectedVariantsStore(value);
    }
  };

  // Lấy action từ Hook
  const {
    isLoading: loading,
    productsLoading,
    fetchMyProducts,
    handleCreateCampaign,
    handleAddProducts,
  } = useShopCampaign();

  const shopSales = myCampaigns.filter(
    (c: any) => c.campaignType === "SHOP_SALE",
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sidebar List */}
      <div className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-bold text-2xl text-slate-900 uppercase tracking-tighter flex items-center gap-3 italic">
            Shop Sales
            <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
              {shopSales.length}
            </span>
          </h2>
          <button
            onClick={onAddNew}
            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-orange-600 shadow-xl transition-all active:scale-90 group"
          >
            <Plus
              className="w-6 h-6 group-hover:rotate-90 transition-transform"
              strokeWidth={3}
            />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar p-1">
          {shopSales.length === 0 ? (
            <div className="bg-white rounded-4xl p-12 text-center border-2 border-dashed border-slate-100">
              <Tag className="w-12 h-12 mx-auto mb-4 text-slate-200" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Mạng lưới trống
              </p>
            </div>
          ) : (
            shopSales.map((campaign: any) => (
              <CampaignSidebarCard
                key={campaign.id}
                campaign={campaign}
                isSelected={selectedCampaign?.id === campaign.id}
                status={getDisplayStatus(campaign)}
                onSelect={() => onSelectCampaign(campaign)}
                onToggle={(e: any) =>
                  onToggleStatus(e, campaign.id, campaign.status)
                }
              />
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-8">
        {selectedCampaign ? (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col h-full animate-in zoom-in-95 duration-500">
            <div className="relative h-64 shrink-0 overflow-hidden">
              <Image
                src={
                  typeof selectedCampaign.bannerUrl === "string" && selectedCampaign.bannerUrl.trim().length > 0
                    ? (selectedCampaign.bannerUrl.startsWith("http") || selectedCampaign.bannerUrl.startsWith("/")
                        ? selectedCampaign.bannerUrl
                        : `/${selectedCampaign.bannerUrl}`)
                    : "https://picsum.photos/800/400"
                }
                alt="banner"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-8 left-10 right-10 flex items-end justify-between">
                <div className="text-white space-y-2">
                  <span className="bg-orange-500 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-orange-500/40">
                    Active Node
                  </span>
                  <h2 className="text-4xl font-bold uppercase tracking-tighter italic">
                    {selectedCampaign.name}
                  </h2>
                </div>
                <button
                  onClick={() => onAddProducts(selectedCampaign.id)}
                  className="bg-white text-slate-900 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-3xl font-bold text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center gap-3"
                >
                  <Plus size={16} strokeWidth={4} /> Thêm sản phẩm
                </button>
              </div>
            </div>

            <div className="p-10 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">
              <div className="flex items-center gap-2 mb-8 text-orange-500 font-bold uppercase tracking-widest text-xs">
                <TrendingUp size={18} /> PERFORMANCE HUB
              </div>
              {selectedCampaignProducts.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <PackageOpen className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    Chưa có tài sản đăng ký
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCampaignProducts.map((prod: any) => (
                    <ProductAnalyticsCard
                      key={prod.id}
                      prod={prod}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center group">
            <div className="w-32 h-32 bg-orange-50 rounded-[2.5rem] flex items-center justify-center mb-8 ring-8 ring-orange-50 transition-all group-hover:scale-110 shadow-xl">
              <MousePointerClick className="w-16 h-16 text-orange-500" />
            </div>
            <h3 className="text-slate-900 font-bold uppercase tracking-widest text-2xl italic">
              Protocol Offline
            </h3>
            <p className="max-w-xs mt-4 text-slate-400 text-sm font-medium">
              Chọn một chiến dịch từ bảng điều khiển bên trái để kích hoạt
              module quản lý.
            </p>
          </div>
        )}
      </div>

      {/* MODAL ĐĂNG KÝ / TẠO MỚI (Tích hợp PortalModal & 3 Bước) */}
      <CreateCampaignModal
        isOpen={!!showCreateModal}
        onClose={() => setShowCreateModal(null)}
        step={showCreateModal === "addProduct" ? "PRODUCTS" : createStep}
        setStep={setCreateStep}
        form={createForm}
        setForm={setCreateForm}
        loading={loading}
        productsLoading={productsLoading}
        myProducts={myProducts}
        selectedVariants={selectedVariants}
        setSelectedVariants={setSelectedVariants as any}
        onRefreshProducts={fetchMyProducts}
        onSubmit={
          showCreateModal === "addProduct"
            ? handleAddProducts
            : handleCreateCampaign
        }
      />
    </div>
  );
};
