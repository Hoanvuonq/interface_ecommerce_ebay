'use client';

import { useState, useEffect } from 'react';
import { Zap, RefreshCw, AlertCircle, ChevronRight, Search } from 'lucide-react';
import { toast } from 'sonner';

// Components
import {
    FlashSaleBanner,
    SlotTabs,
    ProductCard,
    CampaignCard
} from './_components';

// Types & Data
import type {
    CampaignResponse,
    CampaignSlotResponse,
    CampaignSlotProductResponse
} from './types';
import { mockCampaigns, mockSlots, mockProducts } from './mock-data';
import { campaignService } from './campaign.service';

/**
 * Campaign Demo Page
 * 
 * Features:
 * - Flash Sale Banner with countdown
 * - Time slot tabs
 * - Product grid with discount badges
 * - Campaign list
 * 
 * Design System: Vibrant & Block-based
 * Colors: Primary #2563EB, CTA #F97316
 * Typography: Rubik / Nunito Sans
 */
export default function CampaignDemoPage() {
    // State
    const [campaigns, setCampaigns] = useState<CampaignResponse[]>(mockCampaigns);
    const [slots, setSlots] = useState<CampaignSlotResponse[]>(mockSlots);
    const [products, setProducts] = useState<CampaignSlotProductResponse[]>(mockProducts);
    const [activeCampaign, setActiveCampaign] = useState<CampaignResponse | null>(mockCampaigns[0]);
    const [activeSlotId, setActiveSlotId] = useState<string>(mockSlots[0]?.id || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [useMockData, setUseMockData] = useState(true);

    // Get active slot
    const activeSlot = slots.find(s => s.id === activeSlotId) || slots[0];

    // Fetch data from API
    const fetchFromAPI = async () => {
        setLoading(true);
        setError(null);
        try {
            const [activeCampaignsData, activeSlotsData] = await Promise.all([
                campaignService.getActiveCampaigns(),
                campaignService.getActiveSlots(),
            ]);

            if (activeCampaignsData.length > 0) {
                setCampaigns(activeCampaignsData);
                setActiveCampaign(activeCampaignsData[0]);

                // Fetch slots for first campaign
                const campaignSlots = await campaignService.getCampaignProducts(activeCampaignsData[0].id);
                setSlots(campaignSlots);

                if (campaignSlots.length > 0) {
                    setActiveSlotId(campaignSlots[0].id);
                    const slotProducts = await campaignService.getProductsInSlot(campaignSlots[0].id);
                    setProducts(slotProducts);
                }
            }

            setUseMockData(false);
            toast.success('Đã tải dữ liệu từ API');
        } catch (err: any) {
            console.error('API Error:', err);
            setError(err.message || 'Không thể kết nối API, đang dùng mock data');
            // Fall back to mock data
            setCampaigns(mockCampaigns);
            setSlots(mockSlots);
            setProducts(mockProducts);
            setActiveCampaign(mockCampaigns[0]);
            setActiveSlotId(mockSlots[0]?.id || '');
            setUseMockData(true);
        } finally {
            setLoading(false);
        }
    };

    // Handle slot change
    const handleSlotChange = async (slotId: string) => {
        setActiveSlotId(slotId);

        if (!useMockData) {
            try {
                const slotProducts = await campaignService.getProductsInSlot(slotId);
                setProducts(slotProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        } else {
            // Use mock data
            setProducts(mockProducts);
        }
    };

    // Handle add to cart
    const handleAddToCart = (product: CampaignSlotProductResponse) => {
        toast.success(`Đã thêm "${product.productName}" vào giỏ hàng`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Google Fonts */}
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700&family=Rubik:wght@300;400;500;600;700&display=swap');
        
        .font-rubik { font-family: 'Rubik', sans-serif; }
        .font-nunito { font-family: 'Nunito Sans', sans-serif; }
      `}</style>

            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-linear-to-r from-orange-500 to-red-500 rounded-xl">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-rubik font-bold text-xl text-gray-900">
                                    Campaign Demo
                                </h1>
                                <p className="text-sm text-gray-500">Flash Sale & Promotions</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Mock Data Indicator */}
                            {useMockData && (
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                    Mock Data
                                </span>
                            )}

                            {/* Refresh Button */}
                            <button
                                onClick={fetchFromAPI}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                {loading ? 'Đang tải...' : 'Tải từ API'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
                    <div className="max-w-7xl mx-auto flex items-center gap-2 text-amber-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 font-nunito">
                {/* Flash Sale Banner */}
                {activeCampaign && (
                    <section className="mb-10">
                        <FlashSaleBanner campaign={activeCampaign} activeSlot={activeSlot} />
                    </section>
                )}

                {/* Time Slots */}
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-rubik font-bold text-2xl text-gray-900">
                            Khung giờ sale
                        </h2>
                        <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium cursor-pointer">
                            Xem tất cả <ChevronRight size={16} />
                        </a>
                    </div>
                    <SlotTabs
                        slots={slots}
                        activeSlotId={activeSlotId}
                        onSlotChange={handleSlotChange}
                    />
                </section>

                {/* Products Grid */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-rubik font-bold text-2xl text-gray-900">
                            Sản phẩm Flash Sale
                            <span className="ml-2 text-base font-normal text-gray-500">
                                ({products.length} sản phẩm)
                            </span>
                        </h2>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Tìm sản phẩm..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p>Không có sản phẩm trong khung giờ này</p>
                        </div>
                    )}
                </section>

                {/* Other Campaigns */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-rubik font-bold text-2xl text-gray-900">
                            Chương trình khuyến mãi khác
                        </h2>
                        <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium cursor-pointer">
                            Xem tất cả <ChevronRight size={16} />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.slice(1).map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                onClick={() => {
                                    setActiveCampaign(campaign);
                                    toast.info(`Đã chọn: ${campaign.name}`);
                                }}
                            />
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>Campaign Demo - Built with Next.js & Tailwind CSS</p>
                    <p className="mt-1">Design System: Vibrant & Block-based | Rubik + Nunito Sans</p>
                </div>
            </footer>
        </div>
    );
}
