'use client';

import { useState, useEffect } from 'react';
import {
    Store, Package, Plus, Calendar, Tag, Clock,
    ChevronRight, RefreshCw, AlertCircle, CheckCircle,
    Trash2, Eye, Zap
} from 'lucide-react';
import { toast } from 'sonner';

// Shared components
import { getAuthState } from '../../_shared';

// Services & Types
import { shopCampaignService } from './shop-campaign.service';
import { campaignService } from '../../campaign/campaign.service';
import type {
    CampaignResponse,
    CampaignSlotProductResponse,
    CampaignSlotResponse,
    RegisterProductRequest
} from './types';

/**
 * Shop Campaign Demo Page
 * 
 * Features:
 * - View available platform campaigns to join
 * - Register products for campaign slots
 * - Manage own shop campaigns
 * - View registration status
 */
export default function ShopCampaignDemoPage() {
    // Auth state
    const [authState, setAuthState] = useState(getAuthState());

    // Data state
    const [availableCampaigns, setAvailableCampaigns] = useState<CampaignResponse[]>([]);
    const [myRegistrations, setMyRegistrations] = useState<CampaignSlotProductResponse[]>([]);
    const [myCampaigns, setMyCampaigns] = useState<CampaignResponse[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignResponse | null>(null);
    const [campaignSlots, setCampaignSlots] = useState<CampaignSlotResponse[]>([]);

    // UI state
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'join' | 'my-registrations' | 'my-campaigns'>('join');
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<CampaignSlotResponse | null>(null);

    // Check auth on mount
    useEffect(() => {
        setAuthState(getAuthState());
    }, []);

    // Fetch data when auth changes
    useEffect(() => {
        if (authState.isLoggedIn && authState.role === 'shop') {
            fetchData();
        }
    }, [authState.isLoggedIn, authState.role]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [campaigns, registrations, shopCampaigns] = await Promise.all([
                shopCampaignService.getAvailablePlatformCampaigns().catch(() => []),
                shopCampaignService.getMyRegistrations().catch(() => ({ content: [] })),
                shopCampaignService.getMyCampaigns().catch(() => ({ content: [] })),
            ]);

            setAvailableCampaigns(campaigns);
            setMyRegistrations(registrations.content || []);
            setMyCampaigns(shopCampaigns.content || []);

            toast.success('Đã tải dữ liệu từ API');
        } catch (err: any) {
            toast.error(err.message || 'Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCampaign = async (campaign: CampaignResponse) => {
        setSelectedCampaign(campaign);
        try {
            const slots = await campaignService.getCampaignProducts(campaign.id);
            setCampaignSlots(slots);
        } catch (err) {
            setCampaignSlots(campaign.slots || []);
        }
    };

    const handleCancelRegistration = async (regId: string) => {
        if (!confirm('Bạn có chắc muốn hủy đăng ký này?')) return;

        try {
            await shopCampaignService.cancelRegistration(regId);
            toast.success('Đã hủy đăng ký');
            fetchData();
        } catch (err: any) {
            toast.error(err.message || 'Không thể hủy đăng ký');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // If not logged in or wrong role
    if (!authState.isLoggedIn || authState.role !== 'shop') {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                        <Store className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Campaign Demo</h1>
                    <p className="text-gray-500 mb-6">Đăng ký sản phẩm vào các chương trình Flash Sale</p>

                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm max-w-md mx-auto">
                        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">Yêu cầu đăng nhập</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Vui lòng đăng nhập với tài khoản <strong>Shop Owner</strong> để truy cập tính năng này.
                        </p>
                        <a
                            href="/login"
                            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                        >
                            Đến trang đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-xl">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl text-gray-900">Shop Campaign</h1>
                                <p className="text-sm text-gray-500">Quản lý đăng ký Flash Sale</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-sm text-right mr-2">
                                <p className="font-medium text-gray-900">{authState.user?.username}</p>
                                <p className="text-xs text-gray-500">Shop ID: {authState.user?.shopId}</p>
                            </div>
                            <button
                                onClick={fetchData}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Làm mới
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                    {[
                        { id: 'join', label: 'Tham gia Campaign', icon: Plus },
                        { id: 'my-registrations', label: 'Đăng ký của tôi', icon: Package },
                        { id: 'my-campaigns', label: 'Campaign của tôi', icon: Calendar },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id as typeof activeTab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${activeTab === id
                                ? 'bg-white text-green-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Tab: Tham gia Campaign */}
                {activeTab === 'join' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Campaign List */}
                        <div className="lg:col-span-1">
                            <h2 className="font-semibold text-lg text-gray-900 mb-4">
                                Campaigns có thể tham gia
                            </h2>

                            {availableCampaigns.length === 0 ? (
                                <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                                    <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>Không có campaign nào đang mở đăng ký</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {availableCampaigns.map((campaign) => (
                                        <div
                                            key={campaign.id}
                                            onClick={() => handleSelectCampaign(campaign)}
                                            className={`bg-white rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${selectedCampaign?.id === campaign.id
                                                ? 'ring-2 ring-green-500 shadow-md'
                                                : 'border border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <img
                                                    src={campaign.thumbnailUrl || 'https://picsum.photos/100/100'}
                                                    alt={campaign.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {campaign.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                                            {campaign.campaignType}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {campaign.totalSlots} slots
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Campaign Detail & Slots */}
                        <div className="lg:col-span-2">
                            {selectedCampaign ? (
                                <div className="bg-white rounded-xl overflow-hidden">
                                    {/* Banner */}
                                    <div className="relative h-48">
                                        <img
                                            src={selectedCampaign.bannerUrl || 'https://picsum.photos/800/300'}
                                            alt={selectedCampaign.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h2 className="text-2xl font-bold">{selectedCampaign.name}</h2>
                                            <p className="opacity-90">{selectedCampaign.description}</p>
                                        </div>
                                    </div>

                                    {/* Slots */}
                                    <div className="p-6">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-4">
                                            Chọn khung giờ để đăng ký
                                        </h3>

                                        {campaignSlots.length === 0 ? (
                                            <p className="text-gray-500">Không có slot nào</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {campaignSlots.map((slot) => (
                                                    <div
                                                        key={slot.id}
                                                        className={`p-4 rounded-xl border-2 transition-all ${slot.isFullyBooked
                                                            ? 'border-gray-200 bg-gray-50 opacity-60'
                                                            : 'border-gray-200 hover:border-green-500 cursor-pointer'
                                                            }`}
                                                        onClick={() => {
                                                            if (!slot.isFullyBooked) {
                                                                setSelectedSlot(slot);
                                                                setShowRegisterModal(true);
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${slot.status === 'ACTIVE'
                                                                ? 'bg-red-100 text-red-700'
                                                                : slot.status === 'UPCOMING'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {slot.status}
                                                            </span>
                                                            {slot.isFullyBooked && (
                                                                <span className="text-xs text-amber-600 font-medium">Full</span>
                                                            )}
                                                        </div>

                                                        <p className="font-semibold text-gray-900">
                                                            {slot.slotName || 'Slot'}
                                                        </p>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(slot.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                            {' - '}
                                                            {new Date(slot.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            {slot.approvedProducts}/{slot.maxProducts} sản phẩm
                                                        </p>

                                                        {!slot.isFullyBooked && (
                                                            <button className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer">
                                                                Đăng ký slot này
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl p-12 text-center text-gray-500">
                                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg">Chọn một campaign để xem chi tiết</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab: Đăng ký của tôi */}
                {activeTab === 'my-registrations' && (
                    <div>
                        <h2 className="font-semibold text-lg text-gray-900 mb-4">
                            Đăng ký của tôi ({myRegistrations.length})
                        </h2>

                        {myRegistrations.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center text-gray-500">
                                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p>Bạn chưa đăng ký sản phẩm nào</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {myRegistrations.map((reg) => (
                                    <div key={reg.id} className="bg-white rounded-xl p-4 border border-gray-200">
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={reg.productThumbnail || 'https://picsum.photos/80/80'}
                                                alt={reg.productName}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">
                                                    {reg.productName}
                                                </h3>
                                                <p className="text-sm text-gray-500">{reg.campaignName}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${reg.status === 'APPROVED'
                                                        ? 'bg-green-100 text-green-700'
                                                        : reg.status === 'PENDING'
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {reg.status}
                                                    </span>
                                                    <span className="text-sm text-red-500 font-semibold">
                                                        {formatPrice(reg.salePrice)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                Stock: {reg.stockSold}/{reg.stockLimit}
                                            </span>
                                            {reg.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleCancelRegistration(reg.id)}
                                                    className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Hủy
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Campaign của tôi */}
                {activeTab === 'my-campaigns' && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg text-gray-900">
                                Campaign của tôi ({myCampaigns.length})
                            </h2>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                                <Plus className="w-4 h-4" />
                                Tạo Shop Sale mới
                            </button>
                        </div>

                        {myCampaigns.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center text-gray-500">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p>Bạn chưa tạo shop campaign nào</p>
                                <p className="text-sm mt-1">Tạo Shop Sale để khuyến mãi riêng cho cửa hàng của bạn</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {myCampaigns.map((campaign) => (
                                    <div key={campaign.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all cursor-pointer">
                                        <img
                                            src={campaign.bannerUrl || 'https://picsum.photos/400/200'}
                                            alt={campaign.name}
                                            className="w-full h-32 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${campaign.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700'
                                                    : campaign.status === 'SCHEDULED'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {campaign.status}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {campaign.totalProducts} sản phẩm
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
