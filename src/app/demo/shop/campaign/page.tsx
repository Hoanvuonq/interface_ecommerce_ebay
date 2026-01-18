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
    RegisterProductRequest,
    ProductResponse,
    ProductVariantResponse,
    ShopCampaignDetailResponse // Add this
} from './types';

// ...

export default function ShopCampaignPage() {
    // Data state
    const [authState, setAuthState] = useState(getAuthState());
    const [availableCampaigns, setAvailableCampaigns] = useState<CampaignResponse[]>([]);
    const [myRegistrations, setMyRegistrations] = useState<CampaignSlotProductResponse[]>([]);
    const [myCampaigns, setMyCampaigns] = useState<CampaignResponse[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignResponse | ShopCampaignDetailResponse | null>(null); // Update union type
    const [selectedCampaignProducts, setSelectedCampaignProducts] = useState<CampaignSlotProductResponse[]>([]);
    const [campaignSlots, setCampaignSlots] = useState<CampaignSlotResponse[]>([]);

    // UI state
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'join' | 'my-registrations' | 'my-shop-sales'>('join');
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState<'simple' | 'addProduct' | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<CampaignSlotResponse | null>(null);
    // For adding products to existing campaign
    const [targetCampaignId, setTargetCampaignId] = useState<string | null>(null);

    // Form state
    const [createForm, setCreateForm] = useState({
        name: '',
        description: '',
        startDate: new Date().toISOString().slice(0, 16), // "YYYY-MM-DDTHH:mm"
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // +7 days
        isRecurring: false,
        recurringStartTime: '09:00',
        recurringEndTime: '21:00',
    });

    // Product Selection State
    const [createStep, setCreateStep] = useState<'INFO' | 'PRODUCTS' | 'CONFIRM'>('INFO');
    const [myProducts, setMyProducts] = useState<ProductResponse[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState<{
        [variantId: string]: {
            selected: boolean;
            salePrice?: number;
            discountPercent: number; // Default 10%
            stockLimit: number;      // Default 10
        }
    }>({});

    const fetchMyProducts = async () => {
        setProductsLoading(true);
        try {
            const res = await shopCampaignService.getMyProducts({ page: 0, size: 50 });
            setMyProducts(res.content);
        } catch (error) {
            console.error('Failed to fetch products', error);
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setProductsLoading(false);
        }
    };


    const handleCreateCampaign = async () => {
        if (!createForm.name || !createForm.startDate || !createForm.endDate) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setLoading(true);
        try {
            // Prepare products payload
            const productsPayload = Object.entries(selectedVariants)
                .filter(([_, config]) => config.selected)
                .map(([variantId, config]) => ({
                    variantId,
                    salePrice: config.salePrice || 0,
                    stockLimit: config.stockLimit,
                }));

            // For simple shop sale
            if (showCreateModal === 'simple') {
                // Convert local datetime-local input to UTC ISO string
                const startDateUTC = new Date(createForm.startDate).toISOString();
                const endDateUTC = new Date(createForm.endDate).toISOString();

                await shopCampaignService.createShopCampaign({
                    name: createForm.name,
                    description: createForm.description,
                    // campaignType removed - backend forces SHOP_SALE
                    startDate: startDateUTC, // UTC ISO string: "2026-01-17T14:00:00.000Z"
                    endDate: endDateUTC,     // UTC ISO string
                    products: productsPayload.length > 0 ? productsPayload : undefined,
                });
            } else {
                toast.info('Tính năng Flash Sale nâng cao đang được cập nhật');
                setLoading(false);
                return;
            }

            toast.success('Tạo campaign thành công!');
            setShowCreateModal(null);
            fetchData(); // Refresh list
        } catch (err: any) {
            toast.error(err.message || 'Lỗi khi tạo campaign');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProducts = async () => {
        if (!targetCampaignId) return;

        setLoading(true);
        try {
            // Prepare products payload
            const productsPayload = Object.entries(selectedVariants)
                .filter(([_, config]) => config.selected)
                .map(([variantId, config]) => ({
                    variantId,
                    salePrice: config.salePrice || 0,
                    stockLimit: config.stockLimit,
                }));

            if (productsPayload.length === 0) {
                toast.error('Vui lòng chọn ít nhất 1 sản phẩm');
                setLoading(false);
                return;
            }

            await shopCampaignService.addProductsToShopCampaign(targetCampaignId, productsPayload);

            toast.success('Thêm sản phẩm thành công!');
            setShowCreateModal(null);
            setTargetCampaignId(null);
            fetchData(); // Refresh list
        } catch (err: any) {
            toast.error(err.message || 'Lỗi khi thêm sản phẩm');
        } finally {
            setLoading(false);
        }
    };

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
        // Initial set (from list view)
        setSelectedCampaign(campaign);
        setSelectedCampaignProducts([]);
        setCampaignSlots([]);

        try {
            if (campaign.campaignType === 'SHOP_SALE') {
                // Fetch dedicated detail DTO
                const detail = await shopCampaignService.getMyCampaignDetail(campaign.id);
                setSelectedCampaign(detail);
                if (detail.products) setSelectedCampaignProducts(detail.products);
            } else {
                // Platform campaign -> fetch slots
                const slots = await campaignService.getCampaignProducts(campaign.id);
                setCampaignSlots(slots);
            }
        } catch (err) {
            console.error(err);
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

    const handleToggleCampaign = async (e: React.MouseEvent, campaignId: string, currentStatus: string) => {
        e.stopPropagation(); // Prevent card click
        const action = currentStatus === 'PAUSED' ? 'Tiếp tục' : 'Tạm dừng';
        // if (!confirm(`Bạn có chắc muốn ${action} campaign này?`)) return;

        try {
            await shopCampaignService.toggleShopCampaign(campaignId);
            toast.success(`Đã  ${action} campaign`);
            fetchData();
        } catch (err: any) {
            toast.error(err.message || 'Lỗi khi thay đổi trạng thái');
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

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDisplayStatus = (campaign: CampaignResponse) => {
        const now = new Date();
        const start = new Date(campaign.startDate);
        const end = new Date(campaign.endDate);

        if (campaign.status === 'PAUSED') {
            return { label: 'Tạm dừng', color: 'bg-amber-100 text-amber-700' };
        }
        if (now < start) {
            return { label: 'Sắp diễn ra', color: 'bg-blue-100 text-blue-700' };
        }
        if (now > end) {
            return { label: 'Đã kết thúc', color: 'bg-gray-100 text-gray-500' };
        }
        return { label: 'Đang diễn ra', color: 'bg-green-100 text-green-700' };
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
                        { id: 'my-shop-sales', label: 'Shop Sales', icon: Tag },
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
                                                        {formatDateTime(campaign.startDate)} - {formatDateTime(campaign.endDate)}
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
                                            src={(selectedCampaign as any).bannerUrl || (selectedCampaign as any).banner || 'https://picsum.photos/800/300'}
                                            alt={selectedCampaign.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h2 className="text-2xl font-bold">{selectedCampaign.name}</h2>
                                            <p className="opacity-90">{selectedCampaign.description}</p>
                                        </div>
                                    </div>

                                    {/* Detail Content */}
                                    <div className="p-6">
                                        {selectedCampaign.campaignType === 'SHOP_SALE' ? (
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900 mb-4">
                                                    Sản phẩm trong chương trình ({selectedCampaignProducts.length})
                                                </h3>
                                                {selectedCampaignProducts.length === 0 ? (
                                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                        <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                        <p className="text-gray-500">Chưa có sản phẩm nào</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                                        {selectedCampaignProducts.map((prod) => (
                                                            <div key={prod.id} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-300 transition-colors">
                                                                <img
                                                                    src={prod.productThumbnail || 'https://picsum.photos/80/80'}
                                                                    alt={prod.productName}
                                                                    className="w-16 h-16 rounded-lg object-cover"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex justify-between items-start">
                                                                        <h4 className="font-medium text-gray-900 truncate pr-2">{prod.productName}</h4>
                                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${prod.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                                            {prod.status}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-4 mt-1 text-sm">
                                                                        <div className="flex items-center gap-1 text-red-600 font-semibold">
                                                                            <Tag className="w-3 h-3" />
                                                                            {formatPrice(prod.salePrice)}
                                                                        </div>
                                                                        <div className="text-gray-500 text-xs">
                                                                            Đã bán: {prod.stockSold}/{prod.stockLimit}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
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
                                            </>
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

                {/* Tab: Shop Sales của tôi */}
                {activeTab === 'my-shop-sales' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* List Column */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-lg text-gray-900">
                                    Shop Sales ({myCampaigns.filter(c => c.campaignType === 'SHOP_SALE').length})
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCreateModal('simple');
                                        setCreateStep('INFO');
                                        setSelectedVariants({});
                                        setCreateForm({
                                            name: '',
                                            description: '',
                                            startDate: new Date().toISOString().split('T')[0],
                                            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                                            isRecurring: false,
                                            recurringStartTime: '09:00',
                                            recurringEndTime: '21:00',
                                        });
                                    }}
                                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                                    title="Tạo Shop Sale Mới"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {myCampaigns.filter(c => c.campaignType === 'SHOP_SALE').length === 0 ? (
                                <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-200">
                                    <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>Chưa có shop sale nào</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myCampaigns.filter(c => c.campaignType === 'SHOP_SALE').map((campaign) => (
                                        <div
                                            key={campaign.id}
                                            onClick={() => handleSelectCampaign(campaign)}
                                            className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedCampaign?.id === campaign.id
                                                ? 'ring-2 ring-green-500 shadow-md'
                                                : 'border border-gray-200'
                                                }`}
                                        >
                                            <div className="relative h-24">
                                                <img
                                                    src={campaign.bannerUrl || 'https://picsum.photos/400/200'}
                                                    alt={campaign.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    {(() => {
                                                        const { label, color } = getDisplayStatus(campaign);
                                                        return (
                                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full shadow-sm ${color}`}>
                                                                {label}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h3 className="font-semibold text-gray-900 truncate">{campaign.name}</h3>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                                </p>

                                                {/* Actions */}
                                                <div className="mt-3 flex gap-2 w-full">
                                                    {/* Only show Pause/Resume for ACTIVE/PAUSED campaigns that haven't ended */}
                                                    {(campaign.status === 'ACTIVE' || campaign.status === 'PAUSED') && (
                                                        <button
                                                            onClick={(e) => handleToggleCampaign(e, campaign.id, campaign.status)}
                                                            className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg border transition-colors ${campaign.status === 'PAUSED'
                                                                ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                                                                : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                                }`}
                                                        >
                                                            {campaign.status === 'PAUSED' ? 'Tiếp tục' : 'Tạm dừng'}
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTargetCampaignId(campaign.id);
                                                            setShowCreateModal('addProduct');
                                                            setCreateStep('PRODUCTS');
                                                            setSelectedVariants({});
                                                            fetchMyProducts();
                                                        }}
                                                        className="flex-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                                                    >
                                                        Thêm SP
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Detail Column (Same as Join Tab) */}
                        <div className="lg:col-span-2">
                            {selectedCampaign ? (
                                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                    {/* Campaign Detail Header */}
                                    <div className="relative h-40">
                                        <img
                                            src={(selectedCampaign as any).bannerUrl || (selectedCampaign as any).banner || 'https://picsum.photos/800/300'}
                                            alt={selectedCampaign.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-white p-2">
                                            <h2 className="text-xl font-bold">{selectedCampaign.name}</h2>
                                            <p className="opacity-90 text-sm line-clamp-1">{selectedCampaign.description}</p>
                                        </div>
                                        {/* Close Detail View Button (Mobile friendly) */}
                                        <button
                                            onClick={() => setSelectedCampaign(null)}
                                            className="absolute top-2 right-2 p-1 bg-black/30 hover:bg-black/50 rounded-full text-white lg:hidden"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Detail Content */}
                                    <div className="p-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    Sản phẩm trong chương trình ({selectedCampaignProducts.length})
                                                </h3>
                                                <button
                                                    onClick={() => {
                                                        setTargetCampaignId(selectedCampaign.id);
                                                        setShowCreateModal('addProduct');
                                                        setCreateStep('PRODUCTS');
                                                        setSelectedVariants({});
                                                        fetchMyProducts();
                                                    }}
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                                >
                                                    <Plus className="w-4 h-4" /> Thêm nhanh
                                                </button>
                                            </div>

                                            {selectedCampaignProducts.length === 0 ? (
                                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                    <p className="text-gray-500">Chưa có sản phẩm nào</p>
                                                    <button
                                                        onClick={() => {
                                                            setTargetCampaignId(selectedCampaign.id);
                                                            setShowCreateModal('addProduct');
                                                            setCreateStep('PRODUCTS');
                                                            setSelectedVariants({});
                                                            fetchMyProducts();
                                                        }}
                                                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                                    >
                                                        Thêm sản phẩm ngay
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                                    {selectedCampaignProducts.map((prod) => (
                                                        <div key={prod.id} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-300 transition-colors group">
                                                            <img
                                                                src={prod.productThumbnail || 'https://picsum.photos/80/80'}
                                                                alt={prod.productName}
                                                                className="w-16 h-16 rounded-lg object-cover"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start">
                                                                    <h4 className="font-medium text-gray-900 truncate pr-2">{prod.productName}</h4>
                                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${prod.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                                        {prod.status}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-4 mt-1 text-sm">
                                                                    <div className="flex items-center gap-1 text-red-600 font-semibold">
                                                                        <Tag className="w-3 h-3" />
                                                                        {formatPrice(prod.salePrice)}
                                                                    </div>
                                                                    <div className="text-gray-500 text-xs">
                                                                        Đã bán: {prod.stockSold}/{prod.stockLimit}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                                                <button title="Chỉnh sửa (Coming soon)" className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl p-12 text-center text-gray-500 h-full flex flex-col items-center justify-center border border-gray-200 border-dashed">
                                    <Tag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium text-gray-900">Chi tiết chương trình</p>
                                    <p className="text-sm text-gray-500 mt-1">Chọn một shop sale để xem danh sách sản phẩm và thống kê</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}


            </main>

            {/* Create Shop Campaign Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {showCreateModal === 'addProduct' ? (
                                            'Thêm sản phẩm vào Campaign'
                                        ) : (
                                            <>
                                                {createStep === 'INFO' && 'Bước 1: Thông tin cơ bản'}
                                                {createStep === 'PRODUCTS' && 'Bước 2: Chọn sản phẩm'}
                                                {createStep === 'CONFIRM' && 'Bước 3: Xác nhận'}
                                            </>
                                        )}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {showCreateModal === 'addProduct' ? (
                                            'Chọn các sản phẩm muốn bổ sung vào chương trình khuyến mãi'
                                        ) : (
                                            `Tạo Shop Sale Mới (${createStep === 'INFO' ? 'Cài đặt chung' : createStep === 'PRODUCTS' ? 'Thêm sản phẩm' : 'Hoàn tất'})`
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <span className="text-2xl text-gray-400">×</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* STEP 1: INFO */}
                            {createStep === 'INFO' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên chương trình *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="VD: Giảm giá hè 2024"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            value={createForm.name}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mô tả
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Mô tả chi tiết về chương trình..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            value={createForm.description}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày giờ bắt đầu
                                            </label>
                                            <input
                                                type="datetime-local"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                                value={createForm.startDate}
                                                onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày giờ kết thúc
                                            </label>
                                            <input
                                                type="datetime-local"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                                value={createForm.endDate}
                                                onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: PRODUCTS */}
                            {createStep === 'PRODUCTS' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm text-gray-600">Chọn sản phẩm tham gia khuyến mãi (Chỉ hiển thị sản phẩm Đã Duyệt).</p>
                                        <button onClick={fetchMyProducts} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                            <RefreshCw className="w-3 h-3" /> Làm mới
                                        </button>
                                    </div>

                                    {productsLoading ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                            <RefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-400 mb-2" />
                                            <p className="text-gray-500">Đang tải sản phẩm...</p>
                                        </div>
                                    ) : (
                                        <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50 sticky top-0 z-10">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá gốc</th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Giá khuyến mãi</th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng bán</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {myProducts.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4} className="p-8 text-center text-gray-500">
                                                                Không tìm thấy sản phẩm nào
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        myProducts.filter(p => p && p.variants && p.variants.length > 0).map(prod => (
                                                            prod.variants.map(variant => (
                                                                <tr key={variant.id} className={`hover:bg-gray-50 transition-colors ${selectedVariants[variant.id]?.selected ? 'bg-green-50' : ''}`}>
                                                                    <td className="px-4 py-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={!!selectedVariants[variant.id]?.selected}
                                                                                onChange={(e) => {
                                                                                    const checked = e.target.checked;
                                                                                    setSelectedVariants(prev => ({
                                                                                        ...prev,
                                                                                        [variant.id]: {
                                                                                            selected: checked,
                                                                                            // Initialize sale price if not set (default 10% off)
                                                                                            salePrice: prev[variant.id]?.salePrice || Math.round(variant.price * 0.9),
                                                                                            discountPercent: prev[variant.id]?.discountPercent || 10,
                                                                                            stockLimit: prev[variant.id]?.stockLimit || 10
                                                                                        }
                                                                                    }));
                                                                                }}
                                                                                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                                                                            />
                                                                            <div>
                                                                                <p className="font-medium text-sm text-gray-900 line-clamp-1" title={prod.name}>{prod.name}</p>
                                                                                <p className="text-xs text-gray-500 mt-0.5">SKU: {variant.sku} {variant.optionValues && variant.optionValues.length > 0 ? `| ${variant.sku}` /* TODO: Better options display */ : ''}</p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-600 text-right whitespace-nowrap">
                                                                        {new Intl.NumberFormat('vi-VN').format(variant.price)}đ
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <div className="flex flex-col items-center gap-1">
                                                                            <input
                                                                                type="number"
                                                                                min="1000"
                                                                                max={variant.price - 1}
                                                                                disabled={!selectedVariants[variant.id]?.selected}
                                                                                value={selectedVariants[variant.id]?.salePrice || variant.price * 0.9} // Default 10% off
                                                                                onChange={(e) => {
                                                                                    let val = parseInt(e.target.value);
                                                                                    if (isNaN(val)) val = 0;
                                                                                    // Ensure not greater than original price
                                                                                    if (val >= variant.price) val = variant.price - 1000;

                                                                                    setSelectedVariants(prev => ({
                                                                                        ...prev,
                                                                                        [variant.id]: {
                                                                                            ...prev[variant.id],
                                                                                            salePrice: val,
                                                                                            discountPercent: Math.round(((variant.price - val) / variant.price) * 100)
                                                                                        }
                                                                                    }));
                                                                                }}
                                                                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-center disabled:bg-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                                                placeholder="Giá bán"
                                                                            />
                                                                            {selectedVariants[variant.id]?.selected && (
                                                                                <span className="text-xs text-red-500 font-medium">
                                                                                    -{selectedVariants[variant.id]?.discountPercent || 10}%
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            disabled={!selectedVariants[variant.id]?.selected}
                                                                            value={selectedVariants[variant.id]?.stockLimit || 10}
                                                                            onChange={(e) => {
                                                                                let val = parseInt(e.target.value);
                                                                                if (isNaN(val)) val = 0;
                                                                                setSelectedVariants(prev => ({
                                                                                    ...prev,
                                                                                    [variant.id]: { ...prev[variant.id], stockLimit: val }
                                                                                }));
                                                                            }}
                                                                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center disabled:bg-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: CONFIRM */}
                            {createStep === 'CONFIRM' && (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                        <h3 className="font-semibold text-blue-900 mb-2">Xác nhận thông tin</h3>
                                        <ul className="space-y-1 text-sm text-blue-800">
                                            <li>• <strong>Tên chương trình:</strong> {createForm.name}</li>
                                            <li>• <strong>Thời gian:</strong> {createForm.startDate} đến {createForm.endDate}</li>
                                            <li>• <strong>Số lượng sản phẩm:</strong> <span className="font-bold">{Object.values(selectedVariants).filter(v => v.selected).length}</span> sản phẩm được chọn</li>
                                        </ul>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        * Lưu ý: Các sản phẩm đã chọn sẽ được đăng ký ngay lập tức khi tạo chương trình.
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end bg-gray-50 rounded-b-2xl">
                            {/* CANCEL button - Always visible */}
                            <button
                                onClick={() => setShowCreateModal(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                            >
                                Hủy
                            </button>

                            {/* ADD PRODUCTS MODE */}
                            {showCreateModal === 'addProduct' && (
                                <button
                                    onClick={handleAddProducts}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    Xác nhận thêm
                                </button>
                            )}

                            {/* CREATE MODE: INFO step */}
                            {showCreateModal === 'simple' && createStep === 'INFO' && (
                                <button
                                    onClick={() => {
                                        if (!createForm.name) return toast.error('Vui lòng nhập tên chương trình');
                                        if (!createForm.startDate || !createForm.endDate) return toast.error('Vui lòng chọn thời gian');
                                        setCreateStep('PRODUCTS');
                                        if (myProducts.length === 0) fetchMyProducts();
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    Tiếp theo <ChevronRight className="w-4 h-4" />
                                </button>
                            )}

                            {/* CREATE MODE: PRODUCTS step */}
                            {showCreateModal === 'simple' && createStep === 'PRODUCTS' && (
                                <>
                                    <button
                                        onClick={() => setCreateStep('INFO')}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        onClick={() => setCreateStep('CONFIRM')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        Tiếp theo <ChevronRight className="w-4 h-4" />
                                    </button>
                                </>
                            )}

                            {/* CREATE MODE: CONFIRM step */}
                            {showCreateModal === 'simple' && createStep === 'CONFIRM' && (
                                <>
                                    <button
                                        onClick={() => setCreateStep('PRODUCTS')}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        onClick={handleCreateCampaign}
                                        disabled={loading}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-200"
                                    >
                                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                        Xác nhận tạo Shop Sale
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )} as any
        </div>
    );
}
