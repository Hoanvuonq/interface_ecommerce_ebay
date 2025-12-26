"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Users, Filter, Zap, ImageIcon, Clock } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import notificationService, { type BroadcastHistoryRecord } from "@/layouts/header/_service/notification.service";
import { cn } from "@/utils/cn";

const audienceStyles: Record<string, { label: string; bg: string; text: string }> = {
    ALL_BUYERS: { label: "Buyers", bg: "bg-blue-50", text: "text-blue-600" },
    ALL_SHOPS: { label: "Shops", bg: "bg-emerald-50", text: "text-emerald-600" },
    ALL_USERS: { label: "Tất cả", bg: "bg-purple-50", text: "text-purple-600" },
};

const priorityStyles: Record<string, { label: string; color: string }> = {
    LOW: { label: "Thấp", color: "text-gray-400" },
    NORMAL: { label: "Thường", color: "text-blue-500" },
    HIGH: { label: "Cao", color: "text-orange-500" },
    URGENT: { label: "Khẩn cấp", color: "text-red-600" },
};

export default function NotificationHistoryTable() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BroadcastHistoryRecord[]>([]);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Filters
    const [audienceFilter, setAudienceFilter] = useState("");
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchNotifications();
    }, [page, audienceFilter, searchText]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const pageData = await notificationService.getBroadcastHistory({
                page,
                size: 10,
                targetAudience: audienceFilter as any || undefined,
                searchText: searchText || undefined,
            });
            setData(pageData.content || []);
            setTotalElements(pageData.totalElements || 0);
        } catch (error) {
            console.error("Fetch error:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Filter Bar - Nhỏ gọn chuẩn Web3 */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                        <input 
                            type="text"
                            placeholder="Tìm tiêu đề..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all w-64 font-medium"
                        />
                    </div>

                    {/* Audience Select */}
                    <select 
                        value={audienceFilter}
                        onChange={(e) => setAudienceFilter(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer min-w-[140px]"
                    >
                        <option value="">Mọi đối tượng</option>
                        <option value="ALL_BUYERS">Buyers</option>
                        <option value="ALL_SHOPS">Shops</option>
                        <option value="ALL_USERS">Tất cả Users</option>
                    </select>
                </div>

                <div className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">
                    Tổng: {totalElements.toLocaleString()} bản ghi
                </div>
            </div>

            {/* Custom Table */}
            <div className="overflow-x-auto rounded-4xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-50">
                            <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
                            <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Nội dung thông báo</th>
                            <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Đối tượng</th>
                            <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Đã gửi</th>
                            <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Ảnh</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-6 bg-gray-50/30"></td>
                                </tr>
                            ))
                        ) : data.length > 0 ? (
                            data.map((record) => (
                                <tr key={record.id} className="hover:bg-orange-50/30 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-2 bg-gray-100 rounded-xl text-gray-500 group-hover:bg-white transition-colors">
                                                <Clock size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-800">{dayjs(record.createdAt).format("DD/MM/YYYY")}</div>
                                                <div className="text-[11px] text-gray-400 font-medium">{dayjs(record.createdAt).format("HH:mm")}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 max-w-md">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-extrabold text-gray-800 line-clamp-1">{record.title}</span>
                                            <span className="text-xs text-gray-500 line-clamp-1 font-medium italic">{record.content || "Không có nội dung"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={cn(
                                            "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            audienceStyles[record.targetAudience]?.bg,
                                            audienceStyles[record.targetAudience]?.text
                                        )}>
                                            {audienceStyles[record.targetAudience]?.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center font-black text-sm text-gray-700">
                                        {record.recipientCount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        {record.imageUrl ? (
                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                                <img src={record.imageUrl} alt="Notif" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <ImageIcon className="text-gray-200" size={20} />
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                                    Không tìm thấy dữ liệu lịch sử.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Web3 Style */}
            <div className="flex items-center justify-center gap-2">
                <button 
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2.5 rounded-2xl border border-gray-200 hover:bg-orange-50 hover:border-orange-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <Filter className="rotate-90" size={16} />
                </button>
                <div className="px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-black text-gray-600 uppercase tracking-widest">
                    Trang {page + 1}
                </div>
                <button 
                    disabled={(page + 1) * 10 >= totalElements}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2.5 rounded-2xl border border-gray-200 hover:bg-orange-50 hover:border-orange-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <Filter className="-rotate-90" size={16} />
                </button>
            </div>
        </div>
    );
}