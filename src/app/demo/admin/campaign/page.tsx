"use client";

import {useState, useEffect} from "react";
import {
    Shield,
    Plus,
    Calendar,
    Tag,
    Clock,
    Zap,
    ChevronRight,
    RefreshCw,
    CheckCircle,
    XCircle,
    Trash2,
    Eye,
    BarChart3,
    Users,
    Package,
    Play,
    Ban,
    Edit
} from "lucide-react";
import {toast} from "sonner";

// Shared components
import {getAuthState} from "../../_shared";

// Services & Types
import {adminCampaignService} from "./admin-campaign.service";
import type {CampaignResponse, CampaignSlotProductResponse, CampaignStatisticsResponse, PagedResponse}
from "./types";
import type {CampaignStatus}
from "../../campaign/types";

export default function AdminCampaignDemoPage() {
    // Auth state
    const [authState,
        setAuthState] = useState(getAuthState());

    // Data state
    const [campaigns,
        setCampaigns] = useState < CampaignResponse[] > ([]);
    const [pendingRegistrations,
        setPendingRegistrations] = useState < CampaignSlotProductResponse[] > ([]);
    const [selectedCampaign,
        setSelectedCampaign] = useState < CampaignResponse | null > (null);
    const [campaignStats,
        setCampaignStats] = useState < CampaignStatisticsResponse | null > (null);
    const [selectedRegistrations,
        setSelectedRegistrations] = useState < string[] > ([],);

    // UI state
    const [loading,
        setLoading] = useState(false);
    const [activeTab,
        setActiveTab] = useState < "campaigns" | "registrations" | "statistics" > ("campaigns");
    const [statusFilter,
        setStatusFilter] = useState < CampaignStatus | "ALL" > ("ALL",);

    // Check auth on mount
    useEffect(() => {
        setAuthState(getAuthState());
    }, []);

    // Fetch data when auth changes
    useEffect(() => {
        if (authState.isLoggedIn && authState.role === "admin") {
            fetchData();
        }
    }, [authState.isLoggedIn, authState.role]);

    const fetchData = async() => {
        setLoading(true);
        try {
            const [campaignsRes,
                registrationsRes] = await Promise.all([
                adminCampaignService
                    .getAllCampaigns(0, 20)
                    .catch(() => ({content: []})),
                adminCampaignService
                    .getPendingRegistrations(0, 20)
                    .catch(() => ({content: []}))
            ]);

            setCampaigns(campaignsRes.content || []);
            setPendingRegistrations(registrationsRes.content || []);

            toast.success("Đã tải dữ liệu từ API");
        } catch (err : any) {
            toast.error(err.message || "Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRegistration = async(regId : string) => {
        try {
            await adminCampaignService.approveRegistration(regId);
            toast.success("Đã duyệt đăng ký");
            fetchData();
        } catch (err : any) {
            toast.error(err.message || "Không thể duyệt");
        }
    };

    const handleRejectRegistration = async(regId : string) => {
        const reason = prompt("Lý do từ chối:");
        if (!reason) 
            return;
        
        try {
            await adminCampaignService.rejectRegistration(regId, reason);
            toast.success("Đã từ chối đăng ký");
            fetchData();
        } catch (err : any) {
            toast.error(err.message || "Không thể từ chối");
        }
    };

    const handleBatchApprove = async() => {
        if (selectedRegistrations.length === 0) {
            toast.error("Chưa chọn đăng ký nào");
            return;
        }

        try {
            const result = await adminCampaignService.batchApprove(selectedRegistrations,);
            toast.success(`Đã duyệt ${result.approved} đăng ký`);
            setSelectedRegistrations([]);
            fetchData();
        } catch (err : any) {
            toast.error(err.message || "Không thể duyệt");
        }
    };

    const handleScheduleCampaign = async(campaignId : string) => {
        try {
            await adminCampaignService.scheduleCampaign(campaignId);
            toast.success("Đã lên lịch campaign");
            fetchData();
        } catch (err : any) {
            toast.error(err.message || "Không thể lên lịch");
        }
    };

    const handleCancelCampaign = async(campaignId : string) => {
        const reason = prompt("Lý do hủy:");
        if (!reason) 
            return;
        
        try {
            await adminCampaignService.cancelCampaign(campaignId, reason);
            toast.success("Đã hủy campaign");
            fetchData();
        } catch (err : any) {
            toast.error(err.message || "Không thể hủy");
        }
    };

    const handleQuickCreateCampaign = async() => {
        // Disabled confirm for automated testing if (!confirm('Tạo nhanh một campaign
        // bắt đầu NGAY BÂY GIỜ để test?')) return;
        console.log("Triggering Quick Create Campaign (NOW)...");

        try {
            const now = new Date();
            const threeDaysLater = new Date(now);
            threeDaysLater.setDate(now.getDate() + 3);

            // Format dates as YYYY-MM-DD for backend if needed, or simple ISO string
            // depending on DTO Assuming backend accepts ISO string or LocalDate
            // (YYYY-MM-DD) Using ISO String for safety with most modern backends, or local
            // YYYY-MM-DD
            const formatDatePayload = (d : Date) => d
                .toISOString()
                .split("T")[0];

            await adminCampaignService.createCampaign({
                name: `Flash Sale Quick Test ${now.getHours()}h${now.getMinutes()}`,
                description: "Campaign tạo nhanh để test hệ thống",
                campaignType: "FLASH_SALE",
                startDate: now.toISOString(), // Schema yêu cầu định dạng ISO (zulu time)
                endDate: threeDaysLater.toISOString(),
                bannerAssetId: "banner-quick-test",
                thumbnailAssetId: "thumb-quick-test",
                displayPriority: 1, // Đảm bảo là kiểu Number
                isFeatured: true, // Thêm field này vì Schema có yêu cầu
            });
            toast.success("Đã tạo campaign thành công (Start: NOW)");
            fetchData();
        } catch (err : any) {
            toast.error(err.message || "Không thể tạo campaign");
        }
    };

    const handleViewStats = async(campaign : CampaignResponse) => {
        setSelectedCampaign(campaign);
        try {
            const stats = await adminCampaignService.getCampaignStatistics(campaign.id,);
            setCampaignStats(stats);
        } catch (err) {
            setCampaignStats(null);
        }
        setActiveTab("statistics");
    };

    const formatPrice = (price : number) => {
        return new Intl
            .NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        })
            .format(price);
    };

    const formatDate = (dateStr : string) => {
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const getStatusColor = (status : CampaignStatus) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-700";
            case "SCHEDULED":
                return "bg-blue-100 text-blue-700";
            case "DRAFT":
                return "bg-gray-100 text-gray-700";
            case "ENDED":
                return "bg-gray-100 text-gray-600";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const toggleRegistrationSelection = (regId : string) => {
        setSelectedRegistrations((prev) => prev.includes(regId)
            ? prev.filter((id) => id !== regId)
            : [
                ...prev,
                regId
            ],);
    };

    // If not logged in or wrong role
    if (!authState.isLoggedIn || authState.role !== "admin") {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-purple-600"/>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Admin Campaign Demo
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Quản lý campaigns và duyệt đăng ký
                    </p>

                    <div
                        className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm max-w-md mx-auto">
                        <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4"/>
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Yêu cầu quyền Admin
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Vui lòng đăng nhập với tài khoản
                            <strong>Admin</strong>
                            để truy cập trang quản trị này.
                        </p>
                        <a
                            href="/login"
                            className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors">
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
                            <div className="p-2 bg-purple-600 rounded-xl">
                                <Shield className="w-6 h-6 text-white"/>
                            </div>
                            <div>
                                <h1 className="font-bold text-xl text-gray-900">
                                    Admin Campaign
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Quản lý Platform Campaigns
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-sm text-right mr-2">
                                <p className="font-medium text-gray-900">
                                    {authState.user
                                        ?.username}
                                </p>
                                <span
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    ADMIN
                                </span>
                            </div>

                            {/* Pending count badge */}
                            {pendingRegistrations.length > 0 && (
                                <span
                                    className="px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-medium">
                                    {pendingRegistrations.length}
                                    chờ duyệt
                                </span>
                            )}

                            <button
                                onClick={fetchData}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                                <RefreshCw
                                    className={`w-4 h-4 ${loading
                                    ? "animate-spin"
                                    : ""}`}/>
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
                        {
                            id: "campaigns",
                            label: "Campaigns",
                            icon: Calendar,
                            badge: campaigns.length
                        }, {
                            id: "registrations",
                            label: "Duyệt đăng ký",
                            icon: Package,
                            badge: pendingRegistrations.length
                        }, {
                            id: "statistics",
                            label: "Thống kê",
                            icon: BarChart3
                        }
                    ].map(({id, label, icon: Icon, badge}) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id as typeof activeTab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${activeTab === id
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"}`}>
                            <Icon className="w-4 h-4"/> {label}
                            {badge !== undefined && badge > 0 && (
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs ${activeTab === id
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-200 text-gray-600"}`}>
                                    {badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Tab: Campaigns */}
                {activeTab === "campaigns" && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <h2 className="font-semibold text-lg text-gray-900">
                                    Platform Campaigns
                                </h2>

                                {/* Status filter */}
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                                    <option value="ALL">Tất cả</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="SCHEDULED">Scheduled</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="ENDED">Ended</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>

                            <button
                                onClick={handleQuickCreateCampaign}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                                <Plus className="w-4 h-4"/>
                                Tạo Test Campaign (NOW)
                            </button>
                        </div>

                        {campaigns.length === 0
                            ? (
                                <div className="bg-white rounded-xl p-12 text-center text-gray-500">
                                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-500"/>
                                    <p>Chưa có campaign nào</p>
                                </div>
                            )
                            : (
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                    Campaign
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                    Type
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                    Status
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                    Thời gian
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                    Stats
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {campaigns.filter((c) => statusFilter === "ALL" || c.status === statusFilter,).map((campaign) => (
                                                <tr key={campaign.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={campaign.thumbnailUrl || "https://picsum.photos/50/50"}
                                                                alt={campaign.name}
                                                                className="w-10 h-10 rounded-lg object-cover"/>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {campaign.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500 truncate max-w-50">
                                                                    {campaign.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span
                                                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                                            {campaign.campaignType}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(campaign.status)}`}>
                                                            {campaign.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        <p>{formatDate(campaign.startDate)}</p>
                                                        <p className="text-gray-500">
                                                            → {formatDate(campaign.endDate)}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm">
                                                        <div className="flex items-center gap-3 text-gray-500">
                                                            <span>{campaign.totalSlots}
                                                                slots</span>
                                                            <span>{campaign.totalProducts}
                                                                SP</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleViewStats(campaign)}
                                                                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                                                                title="Xem thống kê">
                                                                <BarChart3 className="w-4 h-4"/>
                                                            </button>

                                                            {campaign.status === "DRAFT" && (
                                                                <button
                                                                    onClick={() => handleScheduleCampaign(campaign.id)}
                                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                                    title="Lên lịch">
                                                                    <Play className="w-4 h-4"/>
                                                                </button>
                                                            )}

                                                            {["DRAFT", "SCHEDULED", "ACTIVE"].includes(campaign.status,) && (
                                                                <button
                                                                    onClick={() => handleCancelCampaign(campaign.id)}
                                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                                    title="Hủy">
                                                                    <Ban className="w-4 h-4"/>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                    </div>
                )}

                {/* Tab: Registrations */}
                {activeTab === "registrations" && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-lg text-gray-900">
                                Đăng ký chờ duyệt ({pendingRegistrations.length})
                            </h2>

                            {selectedRegistrations.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        Đã chọn {selectedRegistrations.length}
                                    </span>
                                    <button
                                        onClick={handleBatchApprove}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 cursor-pointer">
                                        <CheckCircle className="w-4 h-4"/>
                                        Duyệt tất cả
                                    </button>
                                </div>
                            )}
                        </div>

                        {pendingRegistrations.length === 0
                            ? (
                                <div className="bg-white rounded-xl p-12 text-center text-gray-500">
                                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-300"/>
                                    <p>Không có đăng ký nào chờ duyệt</p>
                                </div>
                            )
                            : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pendingRegistrations.map((reg) => (
                                        <div
                                            key={reg.id}
                                            className={`bg-white rounded-xl p-4 border-2 transition-all cursor-pointer ${selectedRegistrations.includes(reg.id)
                                            ? "border-purple-500 shadow-lg"
                                            : "border-gray-200 hover:border-gray-300"}`}
                                            onClick={() => toggleRegistrationSelection(reg.id)}>
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRegistrations.includes(reg.id)}
                                                    onChange={() => toggleRegistrationSelection(reg.id)}
                                                    className="mt-1"
                                                    onClick={(e) => e.stopPropagation()}/>
                                                <img
                                                    src={reg.productThumbnail || "https://picsum.photos/80/80"}
                                                    alt={reg.productName}
                                                    className="w-16 h-16 rounded-lg object-cover"/>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 truncate">
                                                        {reg.productName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{reg.shopName}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {reg.campaignName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Giá gốc</p>
                                                    <p className="line-through text-gray-500">
                                                        {formatPrice(reg.originalPrice)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Giá sale</p>
                                                    <p className="font-semibold text-red-500">
                                                        {formatPrice(reg.salePrice)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Giảm</p>
                                                    <p className="font-medium text-orange-500">
                                                        {reg.discountPercent}%
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Số lượng</p>
                                                    <p className="font-medium">{reg.stockLimit}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApproveRegistration(reg.id);
                                                }}
                                                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm font-medium">
                                                    <CheckCircle className="w-4 h-4"/>
                                                    Duyệt
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRejectRegistration(reg.id);
                                                }}
                                                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer text-sm font-medium">
                                                    <XCircle className="w-4 h-4"/>
                                                    Từ chối
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
                )}

                {/* Tab: Statistics */}
                {activeTab === "statistics" && (
                    <div>
                        {selectedCampaign
                            ? (
                                <div>
                                    <h2 className="font-semibold text-lg text-gray-900 mb-4">
                                        Thống kê: {selectedCampaign.name}
                                    </h2>

                                    {campaignStats
                                        ? (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                                                        <Calendar className="w-5 h-5"/>
                                                        <span className="text-sm font-medium">Slots</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {campaignStats.totalSlots}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {campaignStats.activeSlots}
                                                        đang active
                                                    </p>
                                                </div>

                                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                                    <div className="flex items-center gap-2 text-green-600 mb-2">
                                                        <CheckCircle className="w-5 h-5"/>
                                                        <span className="text-sm font-medium">Đăng ký</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {campaignStats.totalRegistrations}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {campaignStats.approvedRegistrations}
                                                        đã duyệt
                                                    </p>
                                                </div>

                                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                                    <div className="flex items-center gap-2 text-orange-600 mb-2">
                                                        <Package className="w-5 h-5"/>
                                                        <span className="text-sm font-medium">Đã bán</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {campaignStats.totalSold}
                                                    </p>
                                                    <p className="text-sm text-gray-500">sản phẩm</p>
                                                </div>

                                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                                                        <BarChart3 className="w-5 h-5"/>
                                                        <span className="text-sm font-medium">Doanh thu</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {formatPrice(campaignStats.totalRevenue || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                        : (
                                            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                                                <p>Đang tải thống kê...</p>
                                            </div>
                                        )}
                                </div>
                            )
                            : (
                                <div className="bg-white rounded-xl p-12 text-center text-gray-500">
                                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-500"/>
                                    <p>Chọn một campaign từ tab "Campaigns" để xem thống kê</p>
                                </div>
                            )}
                    </div>
                )}
            </main>
        </div>
    );
}
