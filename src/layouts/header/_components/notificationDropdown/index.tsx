"use client";

import { AppPopover } from "@/components/appPopover";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import { Bell, CheckCircle, Eye, Loader2, Package, Info, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { notificationService } from "../../_service/notification.service";

export const NotificationDropdown = () => {
    const router = useRouter();
    const isAuthenticated = useAuth();
    const [mounted, setMounted] = useState(false);
    
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
    const previousNotificationIdsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        setMounted(true);
    }, []);

    const loadRecentNotifications = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const res: any = await notificationService.list({ page: 0, size: 15 });
            const data = res?.data?.content || res?.content || [];
            setNotifications(data);
        } catch (error) {
            console.error("Lỗi load notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Giữ nguyên logic polling của bạn ở đây...

    const handleItemClick = async (id: string, redirectUrl?: string) => {
        try {
            await notificationService.markRead(id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, readStatus: 'READ' } : n));
            if (redirectUrl) router.push(redirectUrl);
        } catch { }
    };

    // Hàm lấy icon theo loại thông báo
    const getNotificationIcon = (category: string, isUnread: boolean) => {
        const iconClass = isUnread ? "text-orange-600" : "text-gray-400";
        switch (category) {
            case 'ORDER': return <Package size={20} className={iconClass} />;
            case 'SYSTEM': return <Info size={20} className={iconClass} />;
            default: return <Bell size={20} className={iconClass} />;
        }
    };

    const Trigger = (
        <div className="p-2 relative rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer group">
            <Bell size={24} className="group-hover:rotate-12 transition-transform" />
            {mounted && unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-600 text-[10px] text-white font-bold ring-2 ring-[#ee4d2d]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
        </div>
    );

    if (!isAuthenticated || !mounted) return null;

    return (
        <AppPopover 
            trigger={Trigger}
            className="w-90" 
            align="right"
            onOpenChange={(open) => open && loadRecentNotifications()}
        >
            <div className="p-4 font-bold text-base border-b border-gray-100 bg-white flex justify-between items-center">
                Thông báo mới nhận
                {loading && <Loader2 size={16} className="animate-spin text-orange-500" />}
            </div>

            <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-gray-50/30">
                {notifications.length > 0 ? (
                    // Hiển thị tối đa 9 cái như yêu cầu
                    notifications.slice(0, 9).map((notif) => {
                        const isUnread = notif.readStatus === "UNREAD";
                        return (
                            <div
                                key={notif.id}
                                onClick={() => handleItemClick(notif.id, notif.redirectUrl)}
                                className={cn(
                                    "flex items-start gap-3 p-4 transition-all border-b border-gray-100/50 cursor-pointer relative",
                                    isUnread 
                                        ? "bg-white hover:bg-orange-50/30 shadow-[inset_3px_0_0_0_#f97316]" 
                                        : "bg-transparent opacity-75 hover:bg-gray-50"
                                )}
                            >
                                <div className={cn(
                                    "shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border transition-colors",
                                    isUnread ? "bg-orange-100 border-orange-200" : "bg-gray-100 border-gray-200"
                                )}>
                                    {notif.imageUrl ? (
                                        <img src={toPublicUrl(notif.imageUrl)} alt="" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        getNotificationIcon(notif.category, isUnread)
                                    )}
                                </div>

                                <div className="text-sm min-w-0 flex-1">
                                    <p className={cn(
                                        "line-clamp-2 leading-snug mb-1", 
                                        isUnread ? "font-bold text-gray-900" : "font-medium text-gray-600"
                                    )}>
                                        {notif.title}
                                    </p>
                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                        {notif.content}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {new Date(notif.createdDate).toLocaleString('vi-VN', {
                                                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
                                            })}
                                        </span>
                                        <span className={cn(
                                            "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                            isUnread ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-500"
                                        )}>
                                            #{notif.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                        <Bell size={40} className="text-gray-200" />
                        <p className="text-gray-400 text-sm">Bạn không có thông báo nào</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 p-3 bg-white border-t border-gray-100 gap-3">
                <button 
                    onClick={() => notificationService.markAllRead().then(loadRecentNotifications)}
                    className="flex items-center justify-center gap-2 py-2.5 text-xs text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all font-bold border border-gray-100"
                >
                    <CheckCircle size={14} /> Đọc tất cả
                </button>
                <Link
                    href="/notifications"
                    className="flex items-center justify-center gap-2 py-2.5 text-xs text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all font-bold shadow-sm shadow-orange-200"
                >
                    Tất cả <Eye size={14} />
                </Link>
            </div>
        </AppPopover>
    );
};